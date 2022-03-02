window.sound = new Audio();

const setup = (sound) => {
  window.sound.pause();
  window.sound.src = `static://${sound}`;
  return window.sound;
};

const stop = window.sound.pause;

export default {
  setup,
  stop,
};
