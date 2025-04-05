import {app, BrowserWindow, session, ipcMain, dialog} from 'electron';
import Path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ProxyManager} from "./libs/proxy.js";
import {Setting, Storage} from "./libs/storage.js";
import {PageController} from "./main/controller.js";
import {Config} from "./config.js";

const __dirname = Path.dirname(fileURLToPath(import.meta.url));

app.whenReady().then(async () => {
    Config.clearStorage && Storage.clear();
    console.log('=> CenterTunnelUrl:', Setting.getOrDefault('centerTunnelUrl'))
    const proxyManager = new ProxyManager({
        centerTunnelUrl: Setting.getOrDefault('centerTunnelUrl')
    });
    await proxyManager.startAppProxyServer({
        ...Config,
        onInjectPage: (html) => {
            let setting = Setting.getOrDefault();
            let script = `window.localStorage.setting='${JSON.stringify(setting)}'`;
            return html
                .replace(/data-theme=(['"])(dark|light)\1/g, `data-theme="${setting.theme}"`)
                .replace('</head>', `<script>${script};console.log("Injected Script!");</script></head>`);
        }
    });
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        // frame: false,
        // titleBarStyle: 'hidden',
        webPreferences: {
            preload: Path.join(__dirname, 'preload.js'),
        }
    });
    const pageController = new PageController(mainWindow);
    proxyManager.on("kubeTunnelResting", data => pageController.sendMessage('kubeTunnelResting', data));
    proxyManager.on("kubeTunnelReady", data => pageController.sendMessage('kubeTunnelReady', data));
    proxyManager.on("kubeTunnelStopped", data => pageController.sendMessage('kubeTunnelStopped', data));
    proxyManager.on("serviceTunnelStarted", data => {
        pageController.sendMessage('serviceTunnelStarted', data);
        pageController.sendMessage("proxiesUpdate", proxyManager.getServiceTunnelServerInfo());
    });
    proxyManager.on("serviceTunnelStopped", data => {
        pageController.sendMessage('serviceTunnelStopped', data);
        pageController.sendMessage("proxiesUpdate", proxyManager.getServiceTunnelServerInfo());
    });
    ipcMain.handle("page:request", async (sender, {id, type, params}) => {
        let {code, data, msg} = await pageController.invoke(type, params, {proxyManager, pageController});
        sender.sender.send("page:response", {id, code, data, msg});
    });
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    Config.devTools && mainWindow.webContents.openDevTools();
    await mainWindow.loadURL(proxyManager.getPageHost());
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})