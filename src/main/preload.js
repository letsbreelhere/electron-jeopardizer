const { net, contextBridge, ipcRenderer } = require('electron');

const validChannels = [
  'httpGet',
  'saveGameSetup',
  'loadGameSetup',
];


contextBridge.exposeInMainWorld('electron', {
  ipc: {
    invoke(event, ...args) {
      return ipcRenderer.invoke(event, args);
    },

    send(event, arg) {
      ipcRenderer.send(event, arg);
    },

    on(channel, func) {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },

    once(channel, func) {
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
