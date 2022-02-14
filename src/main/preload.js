const { contextBridge, ipcRenderer } = require('electron');
const settings = require('electron-settings');

contextBridge.exposeInMainWorld('electron', {
  ipc: {
    invoke: (event, ...args) => ipcRenderer.invoke(event, args),
    send: (event, arg) => ipcRenderer.send(event, arg),
    on: (channel, func) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel, func) =>
      ipcRenderer.once(channel, (event, ...args) => func(...args)),
  },
});
