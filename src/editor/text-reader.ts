export const readText = (text: string, finished: () => void) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = window.speechSynthesis.getVoices()[0];
  utter.onend = finished;
  window.speechSynthesis.speak(utter);
};

export const cancelSpeech = () => {
  window.speechSynthesis.cancel();
}
