window.sound = new Audio();

const play = (sound) => {
  window.sound.pause();
  window.sound.src = `static://${sound}`
  return window.sound;
}

const stop = window.sound.pause;

export default {
  play,
  stop,
};
