import {browser} from "$app/environment";
import {EventEmitter} from "lib/emitter.js";
import {page} from '$app/state';
import {goto} from '$app/navigation';
import {SynterixSocket} from "lib/socket.js";
import {eventBus, toastProvider} from "store/Common.svelte.js";
import {Utils} from "lib";

const RequestMap = new Map();

class SynterixRequest {
    constructor(url) {
        this.url = url;
    }

    async post(params = {}) {
        let res = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Request-Token": optionsProvider.getValue("token")
            },
            body: JSON.stringify(params)
        });
        let r = await res.json();
        if (r.code === 6 || r.code === 3) {
            if (!SynterixUtils.isPublicRoutes()) {
                await optionsProvider.redirect("/");
            }
        }
        return r;
    }
}

class SynterixCacheableRequest {
    constructor(url) {
        this.url = url;
    }

    loading = $state(false);
    data = [];
    error = $state(false);
    errorMsg = $state(null);
    done = $state(false);
    updated = $state(Date.now());

    async post(params = {}) {
        if (!this.updated) {
            return;
        }
        if (this.done || this.loading) {
            return;
        }
        this.loading = true;
        let response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Request-Token": optionsProvider.getValue("token")
            },
            body: JSON.stringify(params)
        });
        if (response.ok) {
            let {code, data, msg} = await response.json();
            if (code === 6 || code === 3) {
                if (!SynterixUtils.isPublicRoutes()) {
                    window.location.href = '/';
                }
            }
            this.data = data;
            if (code === 0) {
                this.error = false;
                this.loading = false;
            } else {
                this.error = this;
                this.errorMsg = msg;
            }
            this.done = true;
            eventBus.emit("edgesDone");
        } else {
            this.data = null;
            this.error = true;
            this.errorMsg = response.statusText;
            this.loading = false;
            this.done = false;
            eventBus.emit("edgesDone");
        }
    }

    async reload(params = []) {
        this.done = false;
        this.data = [];
        await this.post(params);
    }
}

class ElectronSupporter extends EventEmitter {
    constructor() {
        super();
        if (browser) {
            window.electron?.onPageRequest((sender, {id, code, data, msg}) => {
                if (RequestMap.has(id)) {
                    let {resolve, reject} = RequestMap.get(id);
                    code === 0 ? resolve(data) : reject(msg);
                }
            });
            window.electron?.onPageEvent((sender, {type, data}) => {
                this.emit(type, data);
            });
        }
    }

    request(type, params) {
        if (!browser) {
            return Promise.resolve(null);
        }
        if (!window.electron) {
            return Promise.resolve(null);
        }
        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return new Promise((resolve, reject) => {
            window.electron.request({id, type, params});
            RequestMap.set(id, {resolve, reject});
        });
    }

    isElectronEvn() {
        return browser && window.electron;
    }
}

class ProxiesManager {
    constructor(electron) {
        this.electron = electron;
        this.states = {};
        this.electron.on("proxiesUpdate", async (data) => {
            this.states = data || {};
            this.update();
        });
        this.electron.on('kubeTunnelReady', () => {
            eventBus.emit("kubeTunnelReady");
        });
        if (electron.isElectronEvn()) {
            electron.request("getServiceTunnelServerInfo").then(data => {
                Object.assign(this.states, data || {});
            });
        }
    }

    updated = $state(Date.now());

    get data() {
        let list = optionsProvider.getValue("proxies") || [];
        list.forEach(a => a.status = "Disconnect");
        Reflect.ownKeys(this.states).forEach(id => {
            let t = list.find(a => a.id === id);
            if (t) {
                let {state} = this.states[id];
                t.status = state ? 'Running' : "Disconnect";
            }
        });
        return list;
    }

    keep() {
        if (!this.updated) {
            return null;
        }
        return {
            done(fn) {
                fn && fn();
            }
        };
    }

    update() {
        this.updated = Date.now();
    }

    getProxy(id) {
        return this.data.find(a => a.id === id);
    }

    createProxy(rr) {
        let t = optionsProvider.getValue("proxies");
        if (!(t || []).find(a => a.name === rr.name)) {
            if (!t) {
                t = [];
            }
            t.push(rr);
            optionsProvider.setValue("proxies", t);
            this.updated = Date.now();
            return true;
        }
        return false;
    }

    async updateProxy(rr) {
        await this.stopProxyServer(rr.id);
        let t = optionsProvider.getValue("proxies");
        let tt = (t || []).findIndex(a => a.id === rr.id);
        if (tt !== -1) {
            t[tt] = rr;
            optionsProvider.setValue("proxies", t);
            this.updated = Date.now();
        }
    }

    async removeProxy(id) {
        await this.stopProxyServer(id);
        let t = optionsProvider.getValue("proxies");
        optionsProvider.setValue("proxies", (t || []).filter(a => a.id !== id));
        this.updated = Date.now();
    }

    async startProxyServer(id) {
        let t = this.data.find(a => a.id === id);
        let checkParams = {
            host: t.target.host,
            port: t.target.port,
        }
        if (t.serviceType === 'kube') {
            let {code, msg, body} = await serviceInvoke.post({
                edgeId: t.cluster === 'central' ? null : t.cluster,
                serviceName: 'synterix-kube-proxy',
                path: "/kube/config",
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            if (code !== 0) {
                toastProvider.error(msg);
            } else {
                let {code, msg, data} = JSON.parse(body);
                if (code !== 0) {
                    toastProvider.error(msg);
                }
                checkParams.host = data.host;
                checkParams.port = data.port;
            }
        }
        if (t.cluster !== 'central') {
            checkParams.edgeId = t.cluster;
        }
        let e = await checkService.post(checkParams);
        if (e.code !== 0) {
            toastProvider.error(e.msg);
            return;
        }
        if (electron.isElectronEvn()) {
            if (t && clusters.done) {
                let m = clusters.data.find(b => b.clusterId === t.cluster);
                if (m) {
                    let params = {
                        id: t.id,
                        cluster: t.cluster,
                        token: m.token,
                        target: t.target,
                        localPort: t.localPort
                    };
                    if (t.cluster === 'central') {
                        params.token = optionsProvider.getValue("token");
                    }
                    await electron.request("startProxyTunnel", params);
                }
            }
        }
    }

    async stopProxyServer(id) {
        if (electron.isElectronEvn()) {
            let {code, msg} = await electron.request("stopProxyTunnel", {id});
            if (code !== 0) {
                toastProvider.error(msg);
            }
        }
    }

    async startKubeTunnelServer(type, edgeId) {
        if (type === 'central') {
            if (electron.isElectronEvn()) {
                await electron.request("startKubeTunnelServer", {
                    type,
                    token: optionsProvider.getValue("token")
                });
            }
            return;
        }
        let target = clusters.data.find(a => a.edgeId === edgeId);
        if (target && electron.isElectronEvn()) {
            await electron.request("startKubeTunnelServer", {
                type,
                token: optionsProvider.getValue("token"),
                linkEdgeId: target.edgeId
            });
        }
    }

    async getKubeTunnelServerInfo() {
        if (electron.isElectronEvn()) {
            return await electron.request("getKubeTunnelServerInfo", {});
        }
        return null;
    }

    async downloadKubeconfig(id) {
        let d = this.getProxy(id);
        let {code, msg, body} = await serviceInvoke.post({
            edgeId: d.cluster === 'central' ? null : d.cluster,
            serviceName: 'synterix-kube-proxy',
            path: "/kube/config",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
        if (code !== 0) {
            toastProvider.error(msg);
        } else {
            let {code, msg, data} = JSON.parse(body);
            if (code !== 0) {
                toastProvider.error(msg);
            }
            let {ca, token, namespace} = data;
            let template = `apiVersion: v1
clusters:
- cluster:
    insecure-skip-tls-verify: true
    certificate-authority-data: ${ca}
    server: https://127.0.0.1:${d.localPort}
  name: default-cluster
contexts:
- context:
    cluster: default-cluster
    user: default-user
    namespace: ${namespace}
  name: default-context
current-context: default-context
kind: Config
preferences: {}
users:
- name: default-user
  user:
    token: ${token}`;
            Utils.downloadAsYAML(template, `kubeconfig`);
        }
    }
}

class ThemeManager {
    constructor() {
        if (browser) {
            let t = document.body.getAttribute("data-theme");
            this.theme = t;
        }
    }

    theme = $state("dark");

    isDark() {
        return this.theme === 'dark';
    }

    toDark() {
        this.theme = 'dark';
        optionsProvider.setValue("theme", this.theme);
    }

    toLight() {
        this.theme = 'light';
        optionsProvider.setValue("theme", this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        optionsProvider.setValue("theme", this.theme);
    }
}

class OptionsProvider {
    constructor() {
        this.load();
    }

    values = $state({});

    options = [
        {
            key: "centerTunnelUrl",
            name: "Synterix Service URL",
            desc: "synterix remote service url",
            placeholder: 'synterix remote service url',
            value: "",
            defaultValue: "",
            valid(value) {
                if (!value && !page.url.pathname.startsWith("/setting")) {
                    return {result: false, redirect: "/setting/centerTunnelUrl"};
                }
                return {result: true};
            },
            onupdate({key, value}) {
                if (!electron.isElectronEvn()) {
                    optionsProvider.setValue(key, value);
                    optionsProvider.redirect("/");
                }
                electron.request("setTunnelURL", {key, value}).then(() => {
                    browser && (window.location.href = "/?t=" + Date.now());
                }).catch(e => {
                    console.log(e);
                });
            }
        },
        {
            key: "theme",
            value: "dark",
            defaultValue: "dark"
        },
        {
            key: "token",
            value: "",
            async valid() {
                if (SynterixUtils.isPublicRoutes()) {
                    return {result: true};
                }
                let {code, data} = await check.post();
                let r = {
                    result: code === 0
                };
                if (!r.result) {
                    r.redirect = "/";
                } else {
                    admin.username = data.user.username;
                    admin.userId = data.user.id;
                }
                return r;
            }
        },
        {
            key: "proxies",
            value: []
        }
    ];

    load() {
        if (browser) {
            let setting = JSON.parse(localStorage.setting || "{}");
            Reflect.ownKeys(setting).forEach(key => {
                (this.options.find(b => b.key === key) || {}).value = setting[key];
            });
            setTimeout(() => {
                this.options.forEach(item => {
                    this.values[item.key] = item.value;
                });
            });
        }
    }

    save() {
        if (browser) {
            let setting = {};
            this.options.forEach(item => {
                setting[item.key] = item.value;
            });
            localStorage.setting = JSON.stringify(setting);
            electron.request("saveSetting", localStorage.setting);
            this.values = setting;
        }
    }

    setValue(key, value) {
        if (browser) {
            (this.options.find(b => b.key === key) || {}).value = value;
            this.save();
        }
    }

    hasValue(key) {
        this.load();
        let t = this.options.find(b => b.key === key);
        return t && t.value;
    }

    hasKey(key) {
        return !!this.options.find(b => b.key === key);
    }

    get(key) {
        this.load();
        return this.options.find(b => b.key === key);
    }

    getValue(key) {
        this.load();
        return this.options.find(b => b.key === key)?.value;
    }

    redirect(path) {
        return goto(path);
    }

    valid() {
        this.load();
        let next = true;
        let redirectUrl = "";
        return this.options.reduce((a, item) => {
            return a.then(() => {
                if (!next) {
                    return Promise.resolve();
                }
                if (item.valid) {
                    return Promise.resolve().then(() => item.valid(item.value)).then(({result, redirect}) => {
                        next = result;
                        redirectUrl = redirect;
                    });
                }
            });
        }, Promise.resolve()).then(() => {
            return {next, redirectUrl};
        });
    }
}

class User {
    username = $state("");
    userId = $state(null);
}

export const admin = new User();
export const synterixSocket = {
    _socket: null,
    get() {
        if (!this._socket) {
            this._socket = new SynterixSocket(() => {
                return `/synterix/gateway?token=${optionsProvider.getValue("token")}`;
            });
        }
        return this._socket;
    },
    async start() {
        let socket = await this.get();
        let client = await socket.getClient();
        client.on('gtmEdgesWatch', () => clusters.reload());
        client.on('gtmApisWatch', () => clusters.reload());
        client.on('gtmEdgesState', ({states = []}) => {
            let t = {};
            states.forEach(a => {
                t[a.edgeId] = (a.state === 1 ? 'Connected' : "Disconnect");
            });
            (clusters.data || []).forEach(a => {
                if (t[a.edgeId]) {
                    a.status = t[a.edgeId];
                }
            });
            clusters.updated = Date.now();
        });
        eventBus.on("edgesDone", () => {
            client.sendMessage({type: "mtgEdgesState"});
        });
        client.sendMessage({type: "mtgEdgesState"});
    },
    getClient() {
        let socket = this.get();
        return socket.getClient();
    }
};
export const SynterixUtils = {
    keep(...cacheables) {
        cacheables.forEach(a => a.post());
        return {
            done(fn) {
                if (cacheables.find(a => !a.done || !a.updated) === undefined) {
                    fn && fn();
                }
            }
        };
    },
    isPublicRoutes() {
        let pathname = page.url.pathname;
        if (pathname === '/') {
            return true;
        }
        if (pathname.startsWith("/setting")) {
            return true;
        }
        return false;
    },
    goto(path) {
        goto(path);
    }
}
export const electron = new ElectronSupporter();
export const proxies = new ProxiesManager(electron);
export const themeManager = new ThemeManager();
export const optionsProvider = new OptionsProvider();
export const check = new SynterixRequest("/synterix/admin/check");
export const kubeDesc = new SynterixRequest("/synterix/manage/kube/desc");
export const login = new SynterixRequest("/synterix/admin/login");
export const register = new SynterixRequest("/synterix/admin/register");
export const resetPassword = new SynterixRequest("/synterix/admin/resetPwd");
export const createEdge = new SynterixRequest("/synterix/admin/edge");
export const updateEdge = new SynterixRequest("/synterix/admin/edge/update");
export const deleteEdge = new SynterixRequest("/synterix/admin/edge/delete");
export const createUser = new SynterixRequest("/synterix/admin/register");
export const updateUserPassword = new SynterixRequest("/synterix/admin/resetPwd");
export const removeUser = new SynterixRequest("/synterix/admin/user/remove");
export const listUser = new SynterixRequest("/synterix/admin/user/list");
export const clusters = new SynterixCacheableRequest("/synterix/manage/clusters");
export const edgeDetail = new SynterixRequest("/synterix/admin/edge/detail")
export const createApi = new SynterixRequest("/synterix/admin/api");
export const updateApi = new SynterixRequest("/synterix/admin/api/update");
export const deleteApi = new SynterixRequest("/synterix/admin/api/delete");
export const getApiList = new SynterixRequest("/synterix/admin/api/list");
export const checkService = new SynterixRequest("/synterix/manage/service/check");
export const serviceInvoke = new SynterixRequest("/synterix/manage/service/invoke");