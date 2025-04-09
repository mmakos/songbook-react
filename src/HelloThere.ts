console.log(
  '%cHola hola, czego tutaj szukasz? ' +
    "Jak chcesz sobie zobaczyć kod (i go rowijać), to lepiej odwiedź mojego GitHub'a - tam jest wszystko dostępne. " +
    'A jak ktoś Ci naopowiadał, że możesz tu sobie pohakować, to pamiętaj, że shakujesz (zepsujesz) śpiewnik najwyżej u siebie.',
  'color: #ff6f26; font-weight: bold; font-size: 20px'
);

const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = (): void => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = img.width / 3;
    canvas.height = img.height / 3;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL();
    const style = [
      'font-size: 1px;',
      `padding: ${canvas.height}px ${canvas.width}px;`,
      `background: url(${dataUrl}) no-repeat;`,
      'background-size: contain;',
    ].join(' ');
    console.log('%c ', style);
    console.log(
      ' __    __   _______  __       __        ______\n' +
        '|  |  |  | |   ____||  |     |  |      /  __  \\\n' +
        '|  |__|  | |  |__   |  |     |  |     |  |  |  |\n' +
        '|   __   | |   __|  |  |     |  |     |  |  |  |\n' +
        "|  |  |  | |  |____ |  `----.|  `----.|  `--'  |\n" +
        '|__|  |__| |_______||_______||_______| \\______/\n' +
        '\n' +
        ' ___________  __    __   _______  ______       _______\n' +
        '|           ||  |  |  | |   ____||   _  \\     |   ____|\n' +
        '`---|  |----`|  |__|  | |  |__   |  |_)  |    |  |__\n' +
        '    |  |     |   __   | |   __|  |      /     |   __|\n' +
        '    |  |     |  |  |  | |  |____ |  |\\  \\----.|  |____\n' +
        '    |__|     |__|  |__| |_______|| _| `._____||_______|'
    );
  }
};
img.src = '/hello-there.jpg';
