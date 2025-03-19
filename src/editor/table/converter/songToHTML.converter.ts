import {
  ChordModification,
  IAdditionalSeries,
  IChord,
  IntervalModification,
  ISong,
  ITextRun,
} from '../../../types/song.types.ts';
import { noteAsString } from '../../../chords/chord-display.tsx';

const runToHTML = (run: ITextRun): string => {
  switch (run.style) {
    case 1:
      return `<em>${run.text}</em>`;
    case 2:
      return `<u>${run.text}</u>`;
    case 3:
      return `<strong>${run.text}</strong>`;
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

const songToHTML = (song: ISong): string => {
  const text = [];
  const chords = [];
  const repetitions = [];
  let hasRepetitions = false;
  for (const verse of song.verses) {
    let verseHTML = verse.indent ? `<p data-indent="${verse.indent}">` : '<p>';
    let chordsHTML = '<p>';
    let repetitionsHTML = '';
    let firstLine = true;
    for (const line of verse.lines) {
      if (!firstLine) {
        verseHTML += '<br>';
        chordsHTML += '<br>';
        repetitionsHTML += '<br>';
      }
      firstLine = false;
      if (line.text) {
        for (const run of line.text) {
          verseHTML += runToHTML(run);
        }
        if (line.repetitionEnd) {
          repetitionsHTML += ` |x${line.repetitionEnd > 0 ? line.repetitionEnd : '∞'}`;
          hasRepetitions = true;
        } else if (line.repetition) {
          repetitionsHTML += ' |';
          hasRepetitions = true;
        }
      }
      if (line.chords) {
        let firstSerie = true;
        for (const chordSeries of line.chords.chords) {
          if (!firstSerie) chordsHTML += ' ';
          firstSerie = false;
          if (chordSeries.optional) chordsHTML += '<em>';
          if (chordSeries.silent) chordsHTML += '(';

          let firstChord = true;
          for (const complexChord of chordSeries.chords) {
            if (!firstChord) chordsHTML += ' ';
            firstChord = false;
            chordsHTML += chordToHTML(complexChord.chord);
            if (complexChord.alternative) chordsHTML += '/' + chordToHTML(complexChord.alternative);
          }

          if (chordSeries.repeat) chordsHTML += '…';
          if (chordSeries.silent) chordsHTML += ')';
          if (chordSeries.optional) chordsHTML += '</em>';
        }
      }
    }
    text.push(verseHTML + '</p>');
    chords.push(chordsHTML + '</p>');
    repetitions.push(repetitionsHTML + '</p>');
  }
  let html = '<table><tbody><tr><th>Słowa</th>';
  if (hasRepetitions) html += '<th>Powtórzenia</th>';
  html += '<th>Akordy</th></tr>';

  for (let i = 0; i < text.length; ++i) {
    html += `<tr><td>${text[i]}</td>`;
    if (hasRepetitions) html += `<td><strong>${repetitions[i]}</strong></td>`;
    html += `<td cell-type="chord"><strong>${chords[i]}</strong></td></tr>`;
  }

  return html + '</tbody></table>';
};

export default songToHTML;
