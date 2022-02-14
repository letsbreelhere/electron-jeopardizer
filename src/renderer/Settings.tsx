import { useState, useEffect } from 'react';
import Glyphicon from '@strongdm/glyphicon';

import './Settings.scss';

const Settings = ({ onClose }) => {
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    electron.ipc
      .invoke('getPreference', 'discordWebhookUrl')
      .then(setDiscordWebhookUrl);
  }, []);

  const onChange = (e) => {
    electron.ipc.invoke('setPreference', 'discordWebhookUrl', e.target.value);
  };

  const testWebhook = async () => {
    setLoading(true);
    await electron.ipc.invoke(
      'discordSend',
      'This is how your answers will appear.'
    );
    setLoading(false);
  };

  return (
    <div className="settings">
      <div className="header">
        <a onClick={onClose} role="button">
          <Glyphicon glyph="chevron-left" />
        </a>
        <h1>Settings</h1>
      </div>
      <h2>Discord integration</h2>

      <h3>Webhook URL</h3>
      <input
        style={{ width: `${discordWebhookUrl.length}ch` }}
        onChange={onChange}
        value={discordWebhookUrl}
      />
      <button onClick={testWebhook} disabled={loading}>
        Test
      </button>
    </div>
  );
};

export default Settings;
