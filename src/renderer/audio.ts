window.sound = new Audio();
const audio = (sound) => {
  window.sound.pause();
  window.sound.src = `static://${sound}`
  return window.sound;
}

export default audio;
