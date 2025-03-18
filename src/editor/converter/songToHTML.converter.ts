import {
  ChordModification,
  IAdditionalSeries,
  IChord,
  IntervalModification,
  ISong,
  ITextRun,
} from '../../types/song.types.ts';
import { noteAsString } from '../../chords/chord-display.tsx';

const runToHTML = (run: ITextRun): string => {
  switch (run.style) {
    case 1:
      return `<i>${run.text}</i>`;
    case 2:
      return `<u>${run.text}</u>`;
    case 3:
      return `<b>${run.text}</b>`;
  }
  return run.text;
};

const modificationAsString = (modification: ChordModification | IntervalModification) => {
  switch (modification) {
    case ChordModification.AUG:
      return '<';
    case ChordModification.DIM:
      return '>';
    case ChordModification.CLUSTER:
      return '*';
  }
  return '';
};

const additionalSeriesAsString = (additionals: IAdditionalSeries): string => {
  let str = '';
  if (additionals.optional) str += '(';
  str += additionals.elements
    .map((additional) => {
      let str = '' + additional.interval;
      if (additional.modification) str += modificationAsString(additional.modification);
      return str;
    })
    .join('-');
  if (additionals.optional) str += ')';

  return str;
};

const chordToHTML = (chord: IChord): string => {
  let str = noteAsString(chord.note, chord.minor, {});
  if (chord.modification) str += modificationAsString(chord.modification);
  if (chord.noPrime) {
    str += '<sub><s>1</s>';
    str += !chord.base ? '</sub>' : ' ';
  }
  if (chord.base) {
    if (!chord.noPrime) str += '<sub>';
    str += additionalSeriesAsString(chord.base);
    str += '</sub>';
  }
  if (chord.additionals) {
    str += '<sup>';
    let firstSerie = true;
    for (const additionalSerie of chord.additionals) {
      if (!firstSerie) str += ' ';
      firstSerie = false;
      str += additionalSeriesAsString(additionalSerie);
    }
    str += '</sup>';
  }
  return str;
};

const songToHTML = (song: ISong): string[] => {
  let text = '';
  let chords = '<b>';
  for (const verse of song.verses) {
    text += verse.indent ? `<p data-indent="${verse.indent}">` : '<p>';
    chords += '<p>';
    let firstLine = true;
    for (const line of verse.lines) {
      if (!firstLine) {
        text += '<br>';
        chords += '<br>';
      }
      firstLine = false;
      if (line.text) {
        for (const run of line.text) {
          text += runToHTML(run);
        }
        if (line.repetitionEnd) {
          text += ` |x${line.repetitionEnd > 0 ? line.repetitionEnd : '∞'}`;
        } else if (line.repetition) {
          text += ' |';
        }
      }
      if (line.chords) {
        let firstSerie = true;
        for (const chordSeries of line.chords.chords) {
          if (!firstSerie) chords += ' ';
          firstSerie = false;
          if (chordSeries.optional) chords += '<i>';
          if (chordSeries.silent) chords += '(';

          let firstChord = true;
          for (const complexChord of chordSeries.chords) {
            if (!firstChord) chords += ' ';
            firstChord = false;
            chords += chordToHTML(complexChord.chord);
            if (complexChord.alternative) chords += '/' + chordToHTML(complexChord.alternative);
          }

          if (chordSeries.repeat) chords += '…';
          if (chordSeries.silent) chords += ')';
          if (chordSeries.optional) chords += '</i>';
        }
      }
    }
    text += '</p>';
    chords += '</p>';
  }
  chords += '</b>';
  return [text, chords];
};

export default songToHTML;
