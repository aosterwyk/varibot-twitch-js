const { ipcRenderer, contextBridge, shell } = require('electron');

contextBridge.exposeInMainWorld('varibot', {
    setHueAlertsSettings: (sendMsg) => {
        ipcRenderer.invoke('setHueAlertsSettings', sendMsg);
    },
    getHueAlertsSettings: (alertType) => {
        return ipcRenderer.invoke('getHueAlertsSettings', alertType);
    },
    getAllLights: () => {
        return ipcRenderer.invoke('getAllLights');
    },
    hueSettings: (sendMsg) => {
        return ipcRenderer.invoke('hueSettings', sendMsg);
    },
    hueControls: (sendCommand) => {
        ipcRenderer.invoke('hueControls', sendCommand);
    },
    getChannelRewards: () => {
        return ipcRenderer.invoke('getChannelRewards');
    },
    runAd: () => { 
        ipcRenderer.invoke('runAd');
    },
    createStreamMarker: () => {
        ipcRenderer.invoke('createStreamMarker');
    },
    newSoundsSettings: (newpointsSoundsSounds) => {
        ipcRenderer.invoke('newSoundsSettings', newpointsSoundsSounds);
    },
    botSettingsFromForm: (botSettingsFromForm) => {
        return ipcRenderer.invoke('botSettingsFromForm', botSettingsFromForm);
    },
    loadSounds: () => {
        return ipcRenderer.invoke('loadSounds');
    },
    getCurrentCommands: () => {
        return ipcRenderer.invoke('getCurrentCommands');
    },
    getAbout: () => {
        return ipcRenderer.invoke('getAbout');
    },
    updateCmdSettings: (cmdChanges) => {
        ipcRenderer.invoke('updateCmdSettings', cmdChanges);
    },
    getCurrentSettings: () => { 
        return ipcRenderer.invoke('getCurrentSettings');
    },
    identifyLight: (lightId) => {
        ipcRenderer.invoke('identifyLight',lightId);
    },
    getSoundsSettings: () => {
        return ipcRenderer.invoke('getSoundsSettings');
    },
    playRandomSound: () => {
        ipcRenderer.invoke('playRandomSound');
    },
    loadGoogleCredsFile: () => {
        ipcRenderer.invoke('loadGoogleCredsFile');
    },
    externalPage: (page) => {
        shell.openExternal(page);        
    },
    openDir: (dirToOpen) => {
        shell.openPath(dirToOpen);
    },
    receive: (channel, func) => {
        let validChannels = ['status', 'updateRecentEvents'];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }    
} );

// ipcRenderer.on('status', (event, msg) => {
//     updateStatus(msg.type, msg.message);
// });

// ipcRenderer.on('updateRecentEvents', (event, args) => {
//     // console.log(args);
//     updateRecentEvents(args.image, args.user, args.msg);
// });
