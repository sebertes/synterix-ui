import got from 'got';
import {Setting, Proxies} from "../libs/storage.js";

export const Controller = {
    ready(data) {
        return {aa: "aa"};
    },
    async setTunnelURL({key, value}, context) {
        let {body} = await got({
            url: `${value}/admin/ready`,
            method: 'post'
        });
        let {code} = JSON.parse(body);
        if (code !== 0) {
            throw Error("url is not valid");
        }
        Setting.set(key, value);
        context.proxyManager.setCenterTunnelUrl(value);
    },
    saveSetting(data) {
        Setting.setAll(JSON.parse(data));
    },
    async startKubeTunnelServer({type, token, linkEdgeId}, context) {
        try {
            await context.proxyManager.startKubeTunnelServer({type, token, linkEdgeId});
        } catch (e) {
            console.log(e);
        }
    },
    async startProxyTunnel({id, cluster, target, token, localPort}, context) {
        try {
            await context.proxyManager.startServiceTunnelServer({id, cluster, target, token, localPort});
            return {code: 0};
        } catch (e) {
            return {code: 1, msg: e.message}
        }
    },
    async stopProxyTunnel({id}, context) {
        try {
            await context.proxyManager.stopServiceTunnelServer(id);
            return {code: 0};
        } catch (e) {
            return {code: 1, msg: e.message}
        }
    },
    getKubeTunnelServerInfo(a, context) {
        return context.proxyManager.getKubeTunnelServerInfo();
    },
    getServiceTunnelServerInfo(a, context) {
        return context.proxyManager.getServiceTunnelServerInfo();
    }
}

export class PageController {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
    }

    invoke(type, params, context) {
        if (Controller[type]) {
            return Promise.resolve().then(() => Controller[type](params, context)).then(data => {
                return {code: 0, data};
            }).catch(e => {
                return {code: 1, msg: e.message};
            });
        }
        return Promise.reject({code: 1, msg: `Controller ${type} not found`});
    }

    sendMessage(type, data) {
        this.mainWindow.webContents.send('page:event', {type, data});
    }
}