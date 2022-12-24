const { ipcRenderer, contextBridge, shell } = require('electron');

contextBridge.exposeInMainWorld('varibot', {
  loadSounds: () => {
    ipcRenderer.invoke('loadSounds')
  },
  externalPage: (page) => {
    if(page == 'github') {
      shell.openExternal('https://github.com/aosterwyk/pingpal')
    }
  }
});
