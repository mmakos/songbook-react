export const playSound = (midi: number[]) => {
  if (!midi.length) return;
  const context: AudioContext = new AudioContext();
  const gain = context.createGain();
  let gainUpper = undefined;
  if (midi.length > 1) gainUpper = context.createGain();

  const real = new Float32Array([0, 1, 0.5, 0.3, 0.2, 0.1]);
  const imag = new Float32Array(real.length);
  const wave = context.createPeriodicWave(real, imag, { disableNormalization: false });

  gain.gain.setValueAtTime(1, context.currentTime);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 1);
  gain.connect(context.destination);
  gainUpper?.gain.setValueAtTime(0.7, context.currentTime);
  gainUpper?.gain.linearRampToValueAtTime(0, context.currentTime + 1);
  gainUpper?.connect(context.destination);

  midi.forEach((m, i) => {
    const oscillator = context.createOscillator();
    oscillator.setPeriodicWave(wave);
    oscillator.frequency.setTargetAtTime(Math.pow(2, (m - 69) / 12) * 440, context.currentTime, 0);
    oscillator.connect(i === 0 || !gainUpper ? gain : gainUpper);
    oscillator.start();
    oscillator.stop(1);
  });
};

export const playSounds = (
  midi: number[][],
  playingNext: (i: number) => void,
  finished: () => void,
  timeout?: {
    id: number;
  },
  currentNumber?: number
) => {
  if (!currentNumber) currentNumber = 0;
  if (midi.length) {
    playingNext(currentNumber);
    playSound(midi[currentNumber]);
    if (currentNumber < midi.length - 1) {
      if (!timeout) timeout = { id: 0 };
      timeout.id = setTimeout(() => playSounds(midi, playingNext, finished, timeout, currentNumber + 1), 1);
    }
  }
  return () => clearTimeout(timeout?.id);
};
