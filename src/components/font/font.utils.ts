export const pxToPt = (px: number): number => {
  return Math.round((px * 72) / 96);
};

export const chToPt = (ch: number, sizePx: number): number => {
  return pxToPt(ch * sizePx / 2);
};

export const emToPt = (em: number, sizePx: number): number => {
  return Math.round(sizePx * em);
};

export const emToDocxLine = (em: number) => {
  return Math.round(em * 240 / 1.15);
};

export const ptToTwip = (pt: number) => {
  return pt * 20;
};
