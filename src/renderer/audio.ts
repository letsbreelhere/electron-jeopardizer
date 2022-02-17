import { EventRegister } from 'react-native-event-listeners';

window.activeAudio = [];

EventRegister.on('stopAudio', async () => {
  window.activeAudio.forEach((a) => a.pause());
});

EventRegister.on('playAudio', async (sound: string) => {
  window.activeAudio.forEach((a) => a.pause());
  const audio = new Audio(`static://${sound}.mp3`);
  window.activeAudio = [...activeAudio, audio];
  await audio.play();
});

export default {
  play: (sound: string) => EventRegister.emit('playAudio', sound),
  stop: () => EventRegister.emit('stopAudio'),
};
