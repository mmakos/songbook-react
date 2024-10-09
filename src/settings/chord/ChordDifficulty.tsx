import ExpandableSwitch from '../../components/ExpandableSwitch.tsx';
import { IChordDifficulty } from '../../store/songbook.reducer.ts';
import { FormGroup } from '@mui/material';
import { FC } from 'react';

interface IChordDifficultyProps {
  chordDifficulty: IChordDifficulty;
  changeDifficulty: (difficulty: IChordDifficulty) => void;
  showDescription?: boolean;
}

const ChordDifficulty: FC<IChordDifficultyProps> = ({ chordDifficulty, changeDifficulty, showDescription }) => {
  return (
    <FormGroup sx={{ ml: '0.3em' }}>
      <ExpandableSwitch
        label={'Ukryj zmniejszone i zwiększone składniki'}
        expansion={
          <>
            <b>
              A<sup>6&gt;</sup> E<sup>9&gt;</sup>
            </b>
            &nbsp;→&nbsp;
            <b>A E</b>
          </>
        }
        description={
          showDescription ? (
            <>
              Składniki zwiększone i zmniejszone to składniki dodatkowo podwyższone/obniżone o pół tonu. Np.{' '}
              <b>
                E<sup>4</sup>
              </b>{' '}
              to akord E-dur z dodaną kwartą, czyli 4 dźwiękiem od dźwięku <b>E</b> (stąd 4), czyli dźwiękiem <b>A</b>{' '}
              (licząc po dźwiękach gamy E-dur). Składnik zwiększony, np. <b>4&lt;</b> oznacza, że jest to kwarta
              zwiększona, czyli jeszcze pół tonu wyżej niż kwarta czysta, stąd akord{' '}
              <b>
                E<sup>4&lt;</sup>
              </b>{' '}
              nie będzie miał dodanego dźwięku <b>A</b>, tylko <b>Ais</b>.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideUncommonAdditionals}
        onChange={(value) => changeDifficulty({ hideUncommonAdditionals: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Ukryj trudniejsze składniki'}
        expansion={
          <>
            <b>
              a<sup>2</sup> d<sup>6</sup> E<sup>9</sup>
            </b>
            &nbsp;→&nbsp;
            <b>a d E</b>
          </>
        }
        description={
          showDescription ? (
            <>
              Trudniejsze składniki to sekundy (2), seksty (6) i nony (9). Występują one rzadziej niż septymy (7) i
              kwarty (4) i wymagają większej sprawności oraz znajomości akorordów, przez co mogą być nadmiarowe dla
              początkujących instrumentalistów.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideAdditionals269}
        onChange={(value) => changeDifficulty({ hideAdditionals269: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Ukryj kwarty'}
        expansion={
          <>
            <b>
              E<sup>4</sup>
            </b>
            &nbsp;→&nbsp;
            <b>E</b>
          </>
        }
        description={
          showDescription ? (
            <>
              Kwarta jest dodatkowym składnikiem - 4 dźwiękiem licząc od podstawy akordu, np. dla akordu A-dur będzie to
              dźwięk <b>D</b>. Przeważnie występuje jako opóźnienie tercji (czyli dźwięk <b>D</b> zamienia się na dźwięk{' '}
              <b>Cis</b>). W przeciwieństwie do pozostałych trudniejszych składników (2, 6, 9), kwarta jest często
              prosta do zagrania i jednocześnie nierzadko bywa istotną modyfikacją akordu.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideFourths}
        onChange={(value) => changeDifficulty({ hideFourths: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Augmentacje i diminucje w notacji gitarowej'}
        expansion={
          <>
            <b>
              A<sup>7&lt;</sup> e<sup>6&gt;</sup>
            </b>
            &nbsp;→&nbsp;
            <b>
              A<sup>7+</sup> e<sup>6-</sup>
            </b>
          </>
        }
        description={
          showDescription ? (
            <>
              Augumentacje i diminucje składników akordu to odpowiednio podwyższenie i obniżenie tego składnika o pół
              tonu. Np. akord A-dur z septymą{' '}
              <b>
                A<sup>7</sup>
              </b>{' '}
              ma dodatkowo dźwięk <b>G</b>. Jeśli akord ma augumentację septymy, to jest to wtedy akord z septymą
              zwiększoną, czyli dodany jest dźwięk <b>Gis</b>. W notacji muzycznej zapisuje się to za pomocą "&lt;"
              (augmentacja) i "&gt;" (diminucja), natomiast w notacji gitarowej "+" (augmentacja) i "-" (diminucja).
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.guitarIntervalModifications}
        onChange={(value) => changeDifficulty({ guitarIntervalModifications: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Rozdziel opóźnienia na osobne akordy'}
        expansion={
          <>
            <b>
              A<sup>4-3</sup>
            </b>
            &nbsp;→&nbsp;
            <b>
              A<sup>4</sup> A
            </b>
          </>
        }
        description={
          showDescription ? (
            <>
              Czasami akord nie zawsze ma zagrane od razu wszyskie dźwięki. Możemy np. chcieć zagrać akord E-dur, w
              którym na początku zamiast dźwięku <b>Gis</b> będzie dźwięk <b>A</b>, a dźwięk Gis pojawi się dopiero po
              chwili. Taki zabieg nazywamy opóźnieniem. W notacji muzycznej zapisujemy to za pomocą myśnika, np.{' '}
              <b>4-3</b> oznacza opóźnienie kwarty na tercję, czyli w akordzie E-dur dźwięku <b>A</b> na dźwięk{' '}
              <b>Gis</b>. Taki akord możemy jednak rozbić na dwa niezależne akordy, gdzie jeden to będzie akord z dodaną
              kwartą (w domyśle nie posiada on wtedy tercji), a następny akord to już standardowy E-dur.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.splitSuspensions}
        onChange={(value) => changeDifficulty({ splitSuspensions: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Ukryj puste kwinty i unison'}
        expansion={
          <>
            <b>
              A<sup>1</sup> E<sup>5</sup>
            </b>
            &nbsp;→&nbsp;
            <b>A E</b>
          </>
        }
        description={
          showDescription ? (
            <>
              Harmonia nie zawsze musi zkładać się z akordów (trzech i więcej dźwięków). Często chcemy zastosować tak
              zwaną pustą kwintę (czyli dwa dźwięki oddalone o 7 półtonów) lub nawet unison (czyli 1 dźwięk). W swoim
              śpiewniku przyjąłem zasadę, że w przypadku pustej kwinty dopisuję do akordu <b>5</b>, np.{' '}
              <b>
                E<sup>5</sup>
              </b>
              , a w przypadku unisona <b>1</b>, np.{' '}
              <b>
                A<sup>1</sup>
              </b>
              . Jest to szczególnie przydatne na instrumentach klawiszowych, gdzie łatwo jest uzyskać taki efekt.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideUnisonAndFifth}
        onChange={(value) => changeDifficulty({ hideUnisonAndFifth: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Wyświetl maksymalnie 1 dodany składnik'}
        expansion={
          <>
            <b>
              E<sup>64</sup>
            </b>
            &nbsp;→&nbsp;
            <b>
              E<sup>4</sup>
            </b>
          </>
        }
        description={
          showDescription ? (
            <>
              Zwykle widujemy maksymalnie jeden dodany składnik do akordu (i zwykle jest to septyma - 7). Czasami jednak
              akord jest wzbogacony więcej niż jednym dźwiękiem, np. pięknie brzmiący akord cis-moll z dodaną sekundą
              wielką oraz septymą małą (2 i 7). Wtedy zapisujemy te dwa składniki jeden pod drugim (w moim śpiewniku
              jeden obok drugiego ze względu na ograniczenie zapisu do indeksu górnego i dolnego, np.{' '}
              <b>
                cis<sup>27</sup>
              </b>
              ). Zagranie jednak 2 dodatkowych składników wymaga sporej sprawności, zarówno w graniu jak i czytaniu
              akordów. Dlatego można zostawić tylko jeden dodany składnik, co uprości nam grę, a jednocześnie nie
              zabierze całego piękna akordu.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.singleAdditional}
        onChange={(value) => changeDifficulty({ singleAdditional: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Akordy zmniejszone i zwiększone w notacji gitarowej'}
        expansion={
          <>
            <b>e&gt; A&lt;</b>
            &nbsp;→&nbsp;
            <b>
              e<sup>0</sup> A+
            </b>
          </>
        }
        description={
          showDescription ? (
            <>
              Podobnie jak w przypadku składników, cały akord możemy również podać augmentacji lub diminucji. Jest to
              tak naprawdę augmentacja kwinty w akordzie durowym i diminucja kwinty w akordzie molowym. Czyli zwiększony
              E-dur zamiast dźwięku <b>H</b> będzie miał dźwięk <b>His</b> (tak, na klawiaturze pianina to ten sam
              dźwięk co <b>C</b>, tylko że dźwięk <b></b> byłby już sekstą, a my chcemy nadal mieć kwintę, tylko
              zwiększoną), natomiast zmniejszony <b>d-moll</b> będzie miał zamiast dźwięku <b>A</b> dźwięk <b>As</b>. W
              notacji muzycznej takie akordy zapisuje się za pomocą "&lt;" (augmentacja) i "&gt;" (diminucja), natomiast
              w notacji gitarowej "+" (augmentacja) i "0" (diminucja).
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.guitarDiminishedChords}
        onChange={(value) => changeDifficulty({ guitarDiminishedChords: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Ukryj składniki w basie'}
        expansion={
          <>
            <b>
              A<sub>3</sub>
            </b>
            &nbsp;→&nbsp;
            <b>A</b>
          </>
        }
        description={
          showDescription ? (
            <>
              Akord to nie tylko zbiór składników, ale też rozłożenie tych składników w odpowiedniej kolejności.
              Domyślnie i przeważnie akord ma w basie prymę, czyli podstawę akordu - jest to ten sam dźwięk, który
              opisuje akord, np. dla A-dur będzie to dźwięk <b>A</b>. Często jednak chcemy zagrać w basie inny składnik.
              Akord z tercją w basie ma zupełnie inne brzmienie niż ten z prymą w basie. W notacji muzycznej składnik w
              basie zapisuje się pod akordem (w moim śpiewniku jako indeks dolny). Na gitarze, zwłaszcza przy normalnym
              "biciu" nie ma takiej różnicy i rzadko kiedy zastanawiamy się jaką nutę w basie gramy, dlatego oznaczenia
              dźwięków w basie odnoszą się raczej do instrumentów klawiszowych.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideBase}
        onChange={(value) => changeDifficulty({ hideBase: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Ukryj dodany składnik zduplikowany w basie'}
        expansion={
          <>
            <b>
              a<sub>6</sub>
              <sup>6</sup>
            </b>
            &nbsp;→&nbsp;
            <b>
              a<sub>6</sub>
            </b>
          </>
        }
        description={
          showDescription ? (
            <>
              Czasami może wystąpić akord gdzie składnik dodatkowy może być jednocześnie składnikiem w basie. W takim
              wypadku poprawnym zapisem bedzie jego jednoczesne wystąpienie w indeksie górnym (oznaczenie dodatkowego
              składnika) jak i w indeksie dolnym (oznaczenie składnika w basie). Jest to jednak zduplikowanie informacji
              (wiadomo, że jak składnikiem w basie jest septyma, to ta septyma musi być jednocześnie składnikiem
              dodatkowym), dlatego można ukryć wyświetlanie dodatkowego składnika, jeśli jest on już podany jako
              składnik w basie (dla przyspieszenia czytania akordu).
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideBaseAdditional}
        onChange={(value) => changeDifficulty({ hideBaseAdditional: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Ukryj alternatywne akordy'}
        expansion={
          <>
            <b>
              C<sup>7&lt;</sup>/e<sup>6&gt;</sup>
            </b>
            &nbsp;→&nbsp;
            <b>
              C<sup>7&lt;</sup>
            </b>
          </>
        }
        description={
          showDescription ? (
            <>
              Nierzadko ciężko jest mi się zdecydować, który akord brzmiałby lepiej w danym momencie (szczególnie dla
              piosenek bez oryginalnych wykonań, gdzie po prostu zapisuję akordy, takie jakie są). Aby nie ograniczać
              możliwości wykonania piosenki w różnej harmonii, czasami zapisuję alternatywne akordy po ukośniku, np.{' '}
              <b>D/h</b>. Oznacza to, że generalnie gramy D-dur, ale h-moll będzie brzmiał równie dobrze. Jeśli jednak nie
              chcemy sobie zaprzątać głowy alternatywną harmonią, możemy ograniczyć widoczne akordy do jednej harmonii.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.hideAlternatives}
        onChange={(value) => changeDifficulty({ hideAlternatives: value })}
      />
      <ExpandableSwitch
        sx={{ mt: showDescription ? '1em' : undefined }}
        label={'Bemole i krzyżyki jako znaki'}
        expansion={
          <>
            <b>Es Cis</b>
            &nbsp;→&nbsp;
            <b>E♭ C♯</b>
          </>
        }
        description={
          showDescription ? (
            <>
              W Polsce przyjęło się zapisywać podwyższenia i obniżenia akordów tak jak się wymawia, np. <b>Fis</b>,{' '}
              <b>As</b>. Jednak niktórzy praktykują zapis taki jak dźwięki na pięciolini, czyli zamiast "-is" mamy
              krzyżyk <b>♯</b>, a zamiast "-es" mamy bemol <b>♭</b>.
            </>
          ) : undefined
        }
        checked={!!chordDifficulty.signAccidentals}
        onChange={(value) => changeDifficulty({ signAccidentals: value })}
      />
    </FormGroup>
  );
};

export default ChordDifficulty;
