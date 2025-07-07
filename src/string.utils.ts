export const conjugate = (num: number, base: string, single: string, multi: string, genitive: string) => {
  if (num === 1) return base + single;
  const mod10 = num % 10;
  const mod100 = num % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 > 20)) return base + multi;
  return base + genitive;
};

export const capitalizeLine = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const withNonBreakingSpaces = (str: string) => {
  return str.replace(' ', '\u00a0');
};
