import {
  ChordModification,
  IAdditionalSeries,
  IChord,
  IChordSeries,
  IntervalModification,
  ITextRun,
  IVerse,
} from '../../types/song.types.ts';
import { noteAsString } from '../../chords/chord-display.tsx';

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

const parseChords = (chords: IChordSeries[], chordsHTML: string) => {
  let firstSerie = true;
  for (const chordSeries of chords) {
    if (!firstSerie) chordsHTML += ' ';
    firstSerie = false;
    if (chordSeries.silent) chordsHTML += '<em>';
    if (chordSeries.optional) chordsHTML += '(';

    let firstChord = true;
    for (const complexChord of chordSeries.chords) {
      if (!firstChord) chordsHTML += ' ';
      firstChord = false;
      chordsHTML += chordToHTML(complexChord.chord);
      if (complexChord.alternative) chordsHTML += '/' + chordToHTML(complexChord.alternative);
    }

    if (chordSeries.repeat) chordsHTML += '…';
    if (chordSeries.optional) chordsHTML += ')';
    if (chordSeries.silent) chordsHTML += '</em>';
  }
  return chordsHTML;
};

const songToHTML = (verses: IVerse[]): [string, boolean, boolean, boolean] => {
  const text = [];
  const comments = [];
  const chords = [];
  const alternatives = [];
  const repetitions = [];
  let hasRepetitions = false;
  let hasComments = false;
  let hasAlternatives = false;
  for (const verse of verses) {
    let verseHTML = verse.indent ? `<td data-indent="${verse.indent}" cell-type="text">` : '<td cell-type="text">';
    let commentsHTML = '<td cell-type="comment">';
    let chordsHTML = '<td cell-type="chord">';
    let alternativesHTML = '<td cell-type="chord">';
    let repetitionsHTML = '<td cell-type="repetition">';
    for (const line of verse.lines) {
      verseHTML += '<p>';
      commentsHTML += '<p>';
      chordsHTML += '<p>';
      alternativesHTML += '<p>';
      repetitionsHTML += '<p>';
      if (line.text) {
        for (const run of line.text) {
          verseHTML += runToHTML(run);
        }
        if (line.comment) {
          commentsHTML += line.comment;
          hasComments = true;
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
        chordsHTML = parseChords(line.chords.chords, chordsHTML);
        if (line.chords.alternatives) {
          alternativesHTML = parseChords(line.chords.alternatives, alternativesHTML);
          hasAlternatives = true;
        }
      }
      verseHTML += '</p>';
      commentsHTML += '</p>';
      chordsHTML += '</p>';
      alternativesHTML += '</p>';
      repetitionsHTML += '</p>';
    }
    text.push(verseHTML + '</td>');
    comments.push(commentsHTML + '</td>');
    chords.push(chordsHTML + '</td>');
    alternatives.push(alternativesHTML + '</td>');
    repetitions.push(repetitionsHTML + '</td>');
  }
  let html = '<table><tbody><tr><th>Słowa</th>';
  if (hasRepetitions) html += '<th>|x2</th>';
  html += '<th';
  if (hasAlternatives) html += ' colspan="2"';
  html += '>Akordy</th>';
  if (hasComments) html += '<th>Komentarze</th>';
  html += '</tr>';

  for (let i = 0; i < text.length; ++i) {
    html += '<tr>' + text[i];
    if (hasRepetitions) html += repetitions[i];
    html += chords[i];
    if (hasAlternatives) html += alternatives[i];
    if (hasComments) html += comments[i];
    html += '</tr>';
  }

  return [html + '</tbody></table>', hasRepetitions, hasAlternatives, hasComments];
};

export default songToHTML;
