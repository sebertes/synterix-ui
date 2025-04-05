import net from "node:net";
import http from 'node:http';
import fs from 'node:fs';
import WebSocket from 'ws';
import express from 'express';
import {createProxyMiddleware, responseInterceptor} from 'http-proxy-middleware';
import {spawn} from "node:child_process";
import {EventEmitter} from "node:events";
import * as path from "node:path";

const utils = {
    getRandomPort() {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.unref();
            server.on('error', reject);
            server.listen(0, () => {
                const port = server.address().port;
                server.close(() => {
                    resolve(port);
                });
            });
        });
    },
    httpToWebsocketURL(url) {
        if (url.startsWith("http://")) {
            return url.replace(/^http:\/\//, "ws://");
        } else if (url.startsWith("https://")) {
            return url.replace(/^https:\/\//, "wss://");
        }
        return url;
    }
}

class LocalPageServer extends EventEmitter {
    constructor(uiPath) {
        super();
        this.uiPath = uiPath;
        this.serverProcess = null;
        this.isRunning = false;
    }

    start() {
        return new Promise((resolve, reject) => {
            if (this.isRunning) {
                return reject(new Error('Server is already running'));
            }
            this.serverProcess = spawn('node', [this.uiPath]);
            this.serverProcess.stdout.on('data', (data) => {
                this.emit('stdout', data.toString().trim());
            });
            this.serverProcess.stderr.on('data', (data) => {
                this.emit('stderr', data.toString().trim());
            });
            this.serverProcess.on('error', (err) => {
                this.isRunning = false;
                this.emit('error', err);
                reject(err);
            });
            this.serverProcess.on('exit', (code, signal) => {
                this.isRunning = false;
                const message = code !== null ?
                    `Exit with code: ${code}` :
                    `Killed by signal: ${signal}`;
                this.emit('exit', code, signal);
                if (!this.isRunning) {
                    reject(new Error(`Server failed to start: ${message}`));
                }
            });
            const startupTimeout = setTimeout(() => {
                this.isRunning = true;
                this.emit('start');
                resolve();
            }, 3000);
            this.serverProcess.once('exit', () => {
                clearTimeout(startupTimeout);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (!this.serverProcess || !this.isRunning) {
                return reject(new Error('Server is not running'));
            }
            this.serverProcess.once('exit', (code, signal) => {
                this.isRunning = false;
                resolve({code, signal});
            });
            this.serverProcess.kill('SIGTERM');
            setTimeout(() => {
                if (this.isRunning) {
                    this.serverProcess.kill('SIGKILL');
                    reject(new Error('Force terminated after 5 seconds'));
                }
            }, 5000).unref();
        });
    }

    status() {
        return {
            pid: this.serverProcess?.pid,
            isRunning: this.isRunning
        };
    }
}

class TunnelProxyServer extends EventEmitter {
    constructor(port, wsUrl, {type, token, linkHost, linkPort, linkEdgeId} = {}) {
        super();
        this.port = port;
        this.wsUrl = wsUrl;
        if (type === 'central') {
            this.headers = {
                'x-tunnel-type': 'cnt',
                'x-tunnel-token': token,
                'x-tunnel-link-host': linkHost,
                'x-tunnel-link-port': linkPort,
            };
        } else {
            this.headers = {
                'x-tunnel-type': 'lnk',
                'x-tunnel-token': token,
                'x-tunnel-link-edge': linkEdgeId,
                'x-tunnel-link-host': linkHost,
                'x-tunnel-link-port': linkPort,
            };
        }
        this.server = null;
        this.connected = false;
    }

    async start() {
        const tcpServer = this.server = net.createServer((tcpSocket) => {
            console.log('TCP client connected');
            const ws = new WebSocket(this.wsUrl, {binaryType: 'arraybuffer', headers: this.headers});
            ws.on('open', () => {
                console.log('WebSocket connection established');
                tcpSocket.on('data', (data) => {
                    ws.send(data, {binary: true});
                });
            });
            ws.on('message', (message) => {
                if (message instanceof Buffer) {
                    tcpSocket.write(message);
                } else if (message instanceof ArrayBuffer) {
                    tcpSocket.write(Buffer.from(message));
                } else {
                    console.error('Unsupported message type:', typeof message);
                }
            });
            ws.on('close', () => {
                console.log('WebSocket connection closed');
                tcpSocket.end();
            });
            ws.on('error', (err) => {
                console.error('WebSocket error:', err);
                tcpSocket.end();
            });
            tcpSocket.on('close', () => {
                console.log('TCP client disconnected');
                ws.close();
            });
            tcpSocket.on('error', (err) => {
                console.error('TCP socket error:', err);
                ws.close();
            });
        });
        tcpServer.on('close', () => {
            console.log(`TCP server stopped`);
            this.connected = false;
            this.emit("stopped");
        });
        return new Promise((resolve, reject) => {
            tcpServer.listen(this.port, () => {
                this.connected = true;
                resolve();
                this.emit("started");
                console.log(`TCP server listening on port ${this.port}`);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

class KubeProxyServer extends TunnelProxyServer {
    constructor(port, wsUrl, {type, token, edgeId}) {
        super(port, wsUrl);
        this.token = token;
        if (type === 'central') {
            this.headers = {
                'x-tunnel-type': 'cnt',
                'x-tunnel-token': token,
                'x-tunnel-link-svc': 'synterix-kube-proxy'
            };
        } else {
            this.headers = {
                'x-tunnel-type': 'lnk',
                'x-tunnel-token': token,
                'x-tunnel-link-edge': edgeId,
                'x-tunnel-link-svc': 'synterix-kube-proxy'
            };
        }
    }

    resetEdgeTunnel(edgeId) {
        this.headers = {
            'x-tunnel-type': 'lnk',
            'x-tunnel-token': this.token,
            'x-tunnel-link-edge': edgeId,
            'x-tunnel-link-svc': 'synterix-kube-proxy'
        };
    }

    resetCentralTunnel() {
        this.headers = {
            'x-tunnel-type': 'cnt',
            'x-tunnel-token': this.token,
            'x-tunnel-link-svc': 'synterix-kube-proxy'
        };
    }
}

class AppProxyServer {
    constructor({port, centerTunnelUrl = "https://yuntuops.bjttsx.com/synterix/gateway"} = {}) {
        this.port = port;
        this.kubeTunnelUrl = null;
        this.centerTunnelUrl = centerTunnelUrl;
        this.app = null;
        this.server = null;
        this._kubeTunnelMiddleware = null;
        this._centerTunnelMiddleware = null;
        this._activeConnections = new Set();
    }

    _graceStop() {
        process.on('SIGINT', async () => {
            try {
                await this.stop();
                console.log('Proxy server stopped gracefully');
                process.exit(0);
            } catch (err) {
                console.error('Error stopping server:', err);
                process.exit(1);
            }
        });
    }

    _setPageMiddleware(app) {
    }

    _setKubeTunnelMiddleware() {
        if (!this.kubeTunnelUrl) {
            return;
        }
        this._kubeTunnelMiddleware = createProxyMiddleware({
            target: this.kubeTunnelUrl,
            changeOrigin: true,
            ws: true,
            pathRewrite: (path, req) => {
                if (path.startsWith("/kube")) {
                    return path;
                } else {
                    return `/kube${path}`;
                }
            }
        });
    }

    _setCenterTunnelMiddleware() {
        if (!this.centerTunnelUrl) {
            return;
        }
        this._centerTunnelMiddleware = createProxyMiddleware({
            target: this.centerTunnelUrl,
            changeOrigin: true,
        });
    }

    setCenterTunnelUrl(tunnelUrl) {
        this.centerTunnelUrl = tunnelUrl;
        this._setCenterTunnelMiddleware();
    }

    async start() {
        const app = this.app = express();
        const server = this.server = http.createServer(app);
        this._setCenterTunnelMiddleware();
        this._setKubeTunnelMiddleware();
        app.use('/kube', (req, res, next) => {
            this._kubeTunnelMiddleware && this._kubeTunnelMiddleware(req, res, next);
        });
        app.use('/synterix', (req, res, next) => {
            this._centerTunnelMiddleware && this._centerTunnelMiddleware(req, res, next);
        });
        this._setPageMiddleware();
        server.on('upgrade', (req, res, next) => {
            if (req.url.startsWith("/synterix")) {
                this._centerTunnelMiddleware && this._centerTunnelMiddleware.upgrade(req, res, next);
            } else {
                this._kubeTunnelMiddleware && this._kubeTunnelMiddleware.upgrade(req, res, next);
            }
        });
        server.on('connection', (socket) => {
            this._activeConnections.add(socket);
            socket.on('close', () => {
                this._activeConnections.delete(socket);
            });
        });
        return new Promise((resolve, reject) => {
            server.once('error', reject);
            server.listen(this.port, () => resolve(this.port));
        });
    }

    async stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                for (const socket of this._activeConnections) {
                    socket.destroy();
                }
                this._activeConnections.clear();
                if (err && err.code !== 'ERR_SERVER_NOT_RUNNING') {
                    reject(err);
                } else {
                    resolve();
                }
            });
            setTimeout(() => {
                reject(new Error('Server close timeout after 10 seconds'));
            }, 10000).unref();
        });
    }

    bindKubeTunnelServer(kubeProxyServer) {
        this.kubeTunnelUrl = `http://localhost:${kubeProxyServer.port}`;
        this._setKubeTunnelMiddleware();
    }
}

class StaticAppProxyServer extends AppProxyServer {
    constructor({port, centerTunnelUrl, staticDir, onInjectPage} = {}) {
        super({port, centerTunnelUrl});
        this.staticDir = staticDir;
        this.onInjectPage = onInjectPage;
    }

    _setPageMiddleware() {
        this.app.get(['/', '/index.html'], (req, res) => {
            const filePath = path.join(this.staticDir, 'index.html');
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return res.status(404).send('File not found');
                }
                res.type('html').send(this.onInjectPage(data));
            });
        });
        this.app.use('/', express.static(this.staticDir))
    }
}

class RemoteAppProxyServer extends AppProxyServer {
    constructor({port, centerTunnelUrl, pageUrl, onInjectPage} = {}) {
        super({port, centerTunnelUrl});
        this.pageUrl = pageUrl;
        this.onInjectPage = onInjectPage;
    }

    _setPageMiddleware() {
        this.app.use('/', createProxyMiddleware({
            target: this.pageUrl,
            changeOrigin: true,
            selfHandleResponse: true,
            on: {
                proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
                    if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html') && this.onInjectPage) {
                        return this.onInjectPage(responseBuffer.toString('utf8'));
                    }
                    return responseBuffer;
                }),
            },
        }));
    }
}

export class ProxyManager extends EventEmitter {
    constructor({centerTunnelUrl} = {}) {
        super();
        this.centerTunnelUrl = centerTunnelUrl;
        this.appProxyServer = null;
        this.kubeTunnelServer = null;
        this.serviceTunnelServers = new Map();
    }

    getPageHost() {
        if (!this.appProxyServer) {
            return null;
        }
        return `http://localhost:${this.appProxyServer.port}`;
    }

    setCenterTunnelUrl(centerTunnelUrl) {
        this.centerTunnelUrl = centerTunnelUrl;
        if (this.appProxyServer) {
            this.appProxyServer.setCenterTunnelUrl(centerTunnelUrl);
        }
    }

    async startAppProxyServer(options = {}) {
        if (this.appProxyServer) {
            return this.appProxyServer.port;
        }
        options.port = await utils.getRandomPort();
        options.centerTunnelUrl = this.centerTunnelUrl;
        if (options.staticDir) {
            this.appProxyServer = new StaticAppProxyServer(options);
        } else {
            this.appProxyServer = new RemoteAppProxyServer(options);
        }
        await this.appProxyServer.start();
    }

    async startKubeTunnelServer({type, token, linkEdgeId}) {
        console.log('Start kube tunnel:', 'type:', type, 'linkEdgeId:', linkEdgeId);
        this.emit("kubeTunnelResting", {edgeId: linkEdgeId});
        if (this.kubeTunnelServer) {
            if (type === "central") {
                this.kubeTunnelServer.resetCentralTunnel();
            } else {
                this.kubeTunnelServer.resetEdgeTunnel(linkEdgeId);
            }
            this.emit("kubeTunnelReady", {type, edgeId: linkEdgeId});
            return;
        }
        let port = await utils.getRandomPort();
        let ws = utils.httpToWebsocketURL(this.centerTunnelUrl);
        this.kubeTunnelServer = new KubeProxyServer(port, ws + "/gateway", {
            type, token, edgeId: linkEdgeId
        });
        this.kubeTunnelServer.on("stopped", () => {
            this.emit("kubeTunnelStopped", {type, edgeId: linkEdgeId});
        });
        await this.kubeTunnelServer.start();
        this.emit("kubeTunnelReady", {type, edgeId: linkEdgeId});
        this.appProxyServer.bindKubeTunnelServer(this.kubeTunnelServer);
    }

    async startServiceTunnelServer({id, cluster, target, token, localPort}) {
        let {host, port} = target;
        console.log('Start service tunnel:', id, target, cluster, localPort);
        if (!this.serviceTunnelServers.has(id)) {
            let ws = utils.httpToWebsocketURL(this.centerTunnelUrl);
            let tunnel = new TunnelProxyServer(localPort, ws + "/gateway", {
                token,
                type: cluster === 'central' ? 'central' : 'edge',
                linkHost: host,
                linkPort: port,
                linkEdgeId: cluster
            });
            tunnel.on("stopped", () => {
                console.log('Stop service tunnel:', id);
                this.emit("serviceTunnelStopped", {id});
                this.serviceTunnelServers.delete(id);
            });
            await tunnel.start();
            this.serviceTunnelServers.set(id, tunnel);
            this.emit("serviceTunnelStarted", {id});
        }
    }

    async stopServiceTunnelServer(id) {
        if (this.serviceTunnelServers.has(id)) {
            let t = this.serviceTunnelServers.get(id);
            this.serviceTunnelServers.delete(id);
            await t.stop();
        }
    }

    getServiceTunnelServerInfo() {
        let r = {};
        this.serviceTunnelServers.forEach((tunnel, id) => {
            r[id] = {
                state: tunnel.connected,
                localPort: tunnel.port
            }
        });
        return r;
    }

    getKubeTunnelServerInfo() {
        if (this.kubeTunnelServer) {
            let r = this.kubeTunnelServer.headers;
            let proxyType = r['x-tunnel-type'] === 'cnt' ? "central" : "edge";
            return {
                proxyType,
                edgeId: r['x-tunnel-link-edge']
            }
        }
        return null;
    }
}