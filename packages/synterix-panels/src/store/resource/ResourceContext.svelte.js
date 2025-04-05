import {KubeSocket} from "lib/socket.js";
import {eventBus} from "store/Common.svelte.js";

class ResourceContext {
    constructor() {
        this.client = null;
        this.socket = new KubeSocket(() => '/kube/ws');
        this.socket.on("connected", () => this.netState = "connected");
        this.socket.on("reconnect", () => this.netState = "reconnect");
        this.socket.on("error", () => this.netState = "error");
        this.socket.on("closed", () => this.netState = "closed");
        eventBus.on("kubeTunnelReady", async () => {
            if (this.toggling) {
                this.locked = false;
                if (this.client) {
                    return;
                }
                this.client = await this.socket.getClient();
                this.client.on('kubeWatch', a => {
                    eventBus.emit("resourceUpdate", a);
                });
                console.log('=> All done');
                this.toggling = false;
                eventBus.emit("tunnelToggleDone")
                this.ready = true;
            }
        });
    }

    namespace = $state(null);
    locked = $state(false);
    ready = $state(false);
    toggling = $state(false);
    netState = $state("");

    toggleCluster() {
        if (!this.toggling) {
            this.ready = false;
            this.toggling = true;
            this.locked = true;
            this.namespace = null;
            if (this.client) {
                this.client.dispose();
                this.client = null;
            }
            this.socket.close();
            eventBus.emit("resetNamespace");
            console.log('=> Reset local cache');
        }
    }
}

export const resourceContext = new ResourceContext();