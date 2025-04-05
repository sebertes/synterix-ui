const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onPageRequest: callback => {
        ipcRenderer.on('page:response', callback);
    },
    onPageEvent: callback => {
        ipcRenderer.on('page:event', callback);
    },
    request({id, type, params}) {
        ipcRenderer.invoke("page:request", {id, type, params});
    }
});