export const playSound = (midi: number) => {
  const context: AudioContext = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const real = new Float32Array([0, 1, 0.5, 0.3, 0.2, 0.1]);
  const imag = new Float32Array(real.length);
  const wave = context.createPeriodicWave(real, imag, { disableNormalization: false });
  oscillator.setPeriodicWave(wave);

  gain.gain.setValueAtTime(1, context.currentTime);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 1);
  oscillator.frequency.setTargetAtTime(Math.pow(2, (midi - 69) / 12) * 440, context.currentTime, 0);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(1);
};
