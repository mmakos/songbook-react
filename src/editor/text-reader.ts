export const readText = (text: string, finished: () => void) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = window.speechSynthesis.getVoices()[0];
  utter.onend = finished;
  utter.rate = 1.6
  utter.pitch = 3
  utter.volume = 4
  window.speechSynthesis.speak(utter);
};

export const cancelSpeech = () => {
  window.speechSynthesis.cancel();
}
