import storage from 'electron-localstorage';
import {md5} from "./utils.js";

export const Storage = {
    get(key) {
        let t = storage.getItem(key);
        if (t) {
            return JSON.parse(t);
        }
        return null;
    },
    set(key, value) {
        storage.setItem(key, JSON.stringify(value));
    },
    has(key) {
        return !!storage.getItem(key);
    },
    clear() {
        storage.clear();
    }
}

export const Setting = {
    defaultValue: {
        theme: "dark",
        centerTunnelUrl: ""
    },
    getDefault(key) {
        if (key) {
            return this.defaultValue[key];
        }
        return Object.assign({}, this.defaultValue);
    },
    hasDefault(key) {
        return this.defaultValue.hasOwnProperty(key);
    },
    getOrDefault(key) {
        let t = this.get();
        let r = Object.assign({}, this.defaultValue, t || {});
        if (!key) {
            return r;
        }
        return r[key];
    },
    get(key) {
        let t = Storage.get("setting");
        if (t) {
            if (key) {
                return t[key];
            } else {
                return t;
            }
        }
        return null;
    },
    has(key) {
        return !!this.get(key);
    },
    set(key, value) {
        let t = this.getOrDefault();
        t[key] = value;
        Storage.set("setting", t);
    },
    setAll(data = {}) {
        let t = this.getOrDefault();
        Object.assign(t, data);
        Storage.set("setting", t);
    }
}

export const Proxies = {
    get(id) {
        if (Storage.has("proxy")) {
            let list = JSON.parse(Storage.get("proxy") || "[]");
            return list.find(a => a.id === id);
        }
        return null;
    },
    add({edgeId, name, description, host, port, localPort}) {
        let id = md5(`${edgeId}-${host}-${port}`);
        if (Storage.has("proxy")) {
            let list = JSON.parse(Storage.get("proxy") || "[]");
            let t = list.find(a => a.id === id);
            if (!t) {
                list.push({id, edgeId, name, description, host, port});
                Storage.set("proxy", JSON.stringify(list));
            }
        } else {
            let r = [{id, edgeId, name, description, host, port, localPort}];
            Storage.set("proxy", JSON.stringify(r));
        }
    },
    update({id, edgeId, name, description, host, port, localPort}) {
        if (Storage.has("proxy")) {
            let list = JSON.parse(Storage.get("proxy") || "[]");
            let t = list.find(a => a.id === id);
            if (t) {
                t.edgeId = edgeId;
                t.name = name;
                t.description = description;
                t.host = host;
                t.port = port;
                t.localPort = localPort;
                Storage.set("proxy", JSON.stringify(list));
            }
        }
    },
    remove(id) {
        if (Storage.has("proxy")) {
            let list = JSON.parse(Storage.get("proxy") || "[]");
            let t = list.find(a => a.id === id);
            if (t) {
                list.splice(list.indexOf(t), 1);
                Storage.set("proxy", JSON.stringify(list));
            }
        }
    },
    getList() {
        return JSON.parse(Storage.get("proxy") || "[]");
    }
}