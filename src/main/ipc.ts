import path from 'path';
import fs from 'fs';
import fetch from 'electron-fetch';
import * as discord from 'discord-webhook-node';
import settings from 'electron-settings';
import { app, ipcMain } from 'electron';

const gamesPath = path.join(app.getPath('userData'), 'games');
const makeGamesPath = () =>
  !fs.existsSync(gamesPath) && fs.mkdirSync(gamesPath);

const ipcSetup = () => {
  ipcMain.handle('getPreference', (_, [pref]) => settings.get(pref));
  ipcMain.handle('setPreference', (_, [pref, value]) => settings.set(pref, value));
  ipcMain.handle('hasPreference', (_, [pref]) => settings.has(pref));

  ipcMain.handle('discordSend', async (_, [messageText]) => {
    if (settings.hasSync('discordWebhookUrl')) {
      const discordWebhook = new discord.Webhook(
        settings.getSync('discordWebhookUrl')
      );
      discordWebhook.send(messageText);
    }
  });

  ipcMain.handle('httpGet', async (_, [url]) => {
    const res = await fetch(url);
    const body = await res.text();
    return body;
  });

  ipcMain.handle('loadGameSetup', async (_, [name]) => {
    const gamePath = path.join(gamesPath, name);

    if (fs.existsSync(gamePath)) {
      return JSON.parse(fs.readFileSync(gamePath));
    } else {
      return null;
    }
  });

  ipcMain.handle('saveGameSetup', async (_, [name, data]) => {
    makeGamesPath();

    await fs.writeFileSync(path.join(gamesPath, name), data);
    return true;
  });
};

export default ipcSetup;
