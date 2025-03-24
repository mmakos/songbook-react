export const extract = (html: string, startHTML: string, endHTML: string): string[] => {
  const result: string[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const start = html.indexOf(startHTML);
    if (start === -1) break;
    html = html.slice(start + startHTML.length);
    const end = html.indexOf(endHTML);
    result.push(html.slice(0, end));
    html = html.slice(end + endHTML.length);
  }

  return result;
};

export const stripTags = (html: string, startTags: string[], endTags: string[]): string => {
  let sliced;
  do {
    sliced = false;
    for (const s of startTags) {
      if (html.startsWith(s)) {
        html = html.slice(s.length);
        sliced = true;
      }
    }
    for (const e of endTags) {
      if (html.endsWith(e)) {
        html = html.slice(0, html.length - e.length);
        sliced = true;
      }
    }
  } while (sliced);
  return html;
};
