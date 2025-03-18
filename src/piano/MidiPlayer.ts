export const playSound = (midi: number[]) => {
  const context: AudioContext = new AudioContext();
  const gain = context.createGain();

  const real = new Float32Array([0, 1, 0.5, 0.3, 0.2, 0.1]);
  const imag = new Float32Array(real.length);
  const wave = context.createPeriodicWave(real, imag, { disableNormalization: false });

  gain.gain.setValueAtTime(1, context.currentTime);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 1);
  gain.connect(context.destination);

  midi.forEach((m) => {
    const oscillator = context.createOscillator();
    oscillator.setPeriodicWave(wave);
    oscillator.frequency.setTargetAtTime(Math.pow(2, (m - 69) / 12) * 440, context.currentTime, 0);
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(1);
  });
};
