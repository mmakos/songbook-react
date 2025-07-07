import ExpandableSwitch from '../../components/ExpandableSwitch.tsx';
import { IChordDifficulty } from '../../store/songbook.reducer.ts';
import { Stack } from '@mui/material';
import { FC } from 'react';

interface IChordDifficultyProps {
  chordDifficulty: IChordDifficulty;
  changeDifficulty: (difficulty: IChordDifficulty) => void;
  showDescription?: boolean;
  disabled?: boolean;
}

const ChordDifficulty: FC<IChordDifficultyProps> = ({
  chordDifficulty,
  changeDifficulty,
  showDescription,
  disabled,
}) => {
  return (
    <Stack spacing={showDescription ? 1 : 0}>
      <ExpandableSwitch
        label={'Ukryj zmniejszone i zwiększone składniki'}
        expansion={
          <>
            <strong>
              A<sup>6&gt;</sup> E<sup>9&gt;</sup>
            </strong>{' '}
            → <strong>A E</strong>
          </>
        }
        description={
          <>
            Składniki zwiększone i zmniejszone to składniki dodatkowo podwyższone/obniżone o pół tonu. Np.{' '}
            <strong>
              E<sup>4</sup>
            </strong>{' '}
            to akord E-dur z dodaną kwartą, czyli 4 dźwiękiem od dźwięku <strong>E</strong> (stąd 4), czyli dźwiękiem{' '}
            <strong>A</strong> (licząc po dźwiękach gamy E-dur). Składnik zwiększony, np. <strong>4&lt;</strong>{' '}
            oznacza, że jest to kwarta zwiększona, czyli jeszcze pół tonu wyżej niż kwarta czysta, stąd akord{' '}
            <strong>
              E<sup>4&lt;</sup>
            </strong>{' '}
            nie będzie miał dodanego dźwięku <strong>A</strong>, tylko <strong>Ais</strong>.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideUncommonAdditionals}
        onChange={(value) => changeDifficulty({ hideUncommonAdditionals: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj trudniejsze składniki'}
        expansion={
          <>
            <strong>
              a<sup>2</sup> d<sup>6</sup> E<sup>9</sup>
            </strong>{' '}
            → <strong>a d E</strong>
          </>
        }
        description={
          <>
            Trudniejsze składniki to sekundy (2), seksty (6) i nony (9). Występują one rzadziej niż septymy (7) i kwarty
            (4) i wymagają większej sprawności oraz znajomości akorordów, przez co mogą być nadmiarowe dla
            początkujących instrumentalistów.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideAdditionals269}
        onChange={(value) => changeDifficulty({ hideAdditionals269: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj kwarty'}
        expansion={
          <>
            <strong>
              E<sup>4</sup>
            </strong>{' '}
            → <strong>E</strong>
          </>
        }
        description={
          <>
            Kwarta jest dodatkowym składnikiem - 4 dźwiękiem licząc od podstawy akordu, np. dla akordu A-dur będzie to
            dźwięk <strong>D</strong>. Przeważnie występuje jako opóźnienie tercji (czyli dźwięk <strong>D</strong>{' '}
            zamienia się na dźwięk <strong>Cis</strong>). W przeciwieństwie do pozostałych trudniejszych składników (2,
            6, 9), kwarta jest często prosta do zagrania i jednocześnie nierzadko bywa istotną modyfikacją akordu.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideFourths}
        onChange={(value) => changeDifficulty({ hideFourths: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Augmentacje i diminucje w notacji gitarowej'}
        expansion={
          <>
            <strong>
              A<sup>7&lt;</sup> e<sup>6&gt;</sup>
            </strong>{' '}
            →{' '}
            <strong>
              A<sup>7+</sup> e<sup>6-</sup>
            </strong>
          </>
        }
        description={
          <>
            Augumentacje i diminucje składników akordu to odpowiednio podwyższenie i obniżenie tego składnika o pół
            tonu. Np. akord A-dur z septymą{' '}
            <strong>
              A<sup>7</sup>
            </strong>{' '}
            ma dodatkowo dźwięk <strong>G</strong>. Jeśli akord ma augumentację septymy, to jest to wtedy akord z
            septymą zwiększoną, czyli dodany jest dźwięk <strong>Gis</strong>. W notacji muzycznej zapisuje się to za
            pomocą "&lt;" (augmentacja) i "&gt;" (diminucja), natomiast w notacji gitarowej "+" (augmentacja) i "-"
            (diminucja).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.guitarIntervalModifications}
        onChange={(value) => changeDifficulty({ guitarIntervalModifications: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Rozdziel opóźnienia na osobne akordy'}
        expansion={
          <>
            <strong>
              A<sup>4-3</sup>
            </strong>{' '}
            →{' '}
            <strong>
              A<sup>4</sup> A
            </strong>
          </>
        }
        description={
          <>
            Czasami akord nie zawsze ma zagrane od razu wszyskie dźwięki. Możemy np. chcieć zagrać akord E-dur, w którym
            na początku zamiast dźwięku <strong>Gis</strong> będzie dźwięk <strong>A</strong>, a dźwięk Gis pojawi się
            dopiero po chwili. Taki zabieg nazywamy opóźnieniem. W notacji muzycznej zapisujemy to za pomocą myśnika,
            np. <strong>4-3</strong> oznacza opóźnienie kwarty na tercję, czyli w akordzie E-dur dźwięku{' '}
            <strong>A</strong> na dźwięk <strong>Gis</strong>. Taki akord możemy jednak rozbić na dwa niezależne akordy,
            gdzie jeden to będzie akord z dodaną kwartą (w domyśle nie posiada on wtedy tercji), a następny akord to już
            standardowy E-dur.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.splitSuspensions}
        onChange={(value) => changeDifficulty({ splitSuspensions: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj puste kwinty i unison'}
        expansion={
          <>
            <strong>
              A<sup>1</sup> E<sup>5</sup>
            </strong>{' '}
            → <strong>A E</strong>
          </>
        }
        description={
          <>
            Harmonia nie zawsze musi zkładać się z akordów (trzech i więcej dźwięków). Często chcemy zastosować tak
            zwaną pustą kwintę (czyli dwa dźwięki oddalone o 7 półtonów) lub nawet unison (czyli 1 dźwięk). W swoim
            śpiewniku przyjąłem zasadę, że w przypadku pustej kwinty dopisuję do akordu <strong>5</strong>, np.{' '}
            <strong>
              E<sup>5</sup>
            </strong>
            , a w przypadku unisona <strong>1</strong>, np.{' '}
            <strong>
              A<sup>1</sup>
            </strong>
            . Jest to szczególnie przydatne na instrumentach klawiszowych, gdzie łatwo jest uzyskać taki efekt.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideUnisonAndFifth}
        onChange={(value) => changeDifficulty({ hideUnisonAndFifth: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Wyświetl maksymalnie 1 dodany składnik'}
        expansion={
          <>
            <strong>
              E<sup>64</sup>
            </strong>{' '}
            →{' '}
            <strong>
              E<sup>4</sup>
            </strong>
          </>
        }
        description={
          <>
            Zwykle widujemy maksymalnie jeden dodany składnik do akordu (i zwykle jest to septyma - 7). Czasami jednak
            akord jest wzbogacony więcej niż jednym dźwiękiem, np. pięknie brzmiący akord cis-moll z dodaną sekundą
            wielką oraz septymą małą (2 i 7). Wtedy zapisujemy te dwa składniki jeden pod drugim (w moim śpiewniku jeden
            obok drugiego ze względu na ograniczenie zapisu do indeksu górnego i dolnego, np.{' '}
            <strong>
              cis<sup>27</sup>
            </strong>
            ). Zagranie jednak 2 dodatkowych składników wymaga sporej sprawności, zarówno w graniu jak i czytaniu
            akordów. Dlatego można zostawić tylko jeden dodany składnik, co uprości nam grę, a jednocześnie nie zabierze
            całego piękna akordu.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.singleAdditional}
        onChange={(value) => changeDifficulty({ singleAdditional: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Akordy zmniejszone i zwiększone w notacji gitarowej'}
        expansion={
          <>
            <strong>e&gt; A&lt;</strong> →{' '}
            <strong>
              e<sup>0</sup> A+
            </strong>
          </>
        }
        description={
          <>
            Podobnie jak w przypadku składników, cały akord możemy również podać augmentacji lub diminucji. Jest to tak
            naprawdę augmentacja kwinty w akordzie durowym i diminucja kwinty w akordzie molowym. Czyli zwiększony E-dur
            zamiast dźwięku <strong>H</strong> będzie miał dźwięk <strong>His</strong> (tak, na klawiaturze pianina to
            ten sam dźwięk co <strong>C</strong>, tylko że dźwięk <strong></strong> byłby już sekstą, a my chcemy nadal
            mieć kwintę, tylko zwiększoną), natomiast zmniejszony <strong>d-moll</strong> będzie miał zamiast dźwięku{' '}
            <strong>A</strong> dźwięk <strong>As</strong>. W notacji muzycznej takie akordy zapisuje się za pomocą
            "&lt;" (augmentacja) i "&gt;" (diminucja), natomiast w notacji gitarowej "+" (augmentacja) i "0"
            (diminucja).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.guitarDiminishedChords}
        onChange={(value) => changeDifficulty({ guitarDiminishedChords: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj składniki w basie'}
        expansion={
          <>
            <strong>
              A<sub>3</sub>
            </strong>{' '}
            → <strong>A</strong>
          </>
        }
        description={
          <>
            Akord to nie tylko zbiór składników, ale też rozłożenie tych składników w odpowiedniej kolejności. Domyślnie
            i przeważnie akord ma w basie prymę, czyli podstawę akordu - jest to ten sam dźwięk, który opisuje akord,
            np. dla A-dur będzie to dźwięk <strong>A</strong>. Często jednak chcemy zagrać w basie inny składnik. Akord
            z tercją w basie ma zupełnie inne brzmienie niż ten z prymą w basie. W notacji muzycznej składnik w basie
            zapisuje się pod akordem (w moim śpiewniku jako indeks dolny). Na gitarze, zwłaszcza przy normalnym "biciu"
            nie ma takiej różnicy i rzadko kiedy zastanawiamy się jaką nutę w basie gramy, dlatego oznaczenia dźwięków w
            basie odnoszą się raczej do instrumentów klawiszowych.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideBase}
        onChange={(value) => changeDifficulty({ hideBase: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj dodany składnik zduplikowany w basie'}
        expansion={
          <>
            <strong>
              a<sub>6</sub>
              <sup>6</sup>
            </strong>{' '}
            →{' '}
            <strong>
              a<sub>6</sub>
            </strong>
          </>
        }
        description={
          <>
            Czasami może wystąpić akord gdzie składnik dodatkowy może być jednocześnie składnikiem w basie. W takim
            wypadku poprawnym zapisem bedzie jego jednoczesne wystąpienie w indeksie górnym (oznaczenie dodatkowego
            składnika) jak i w indeksie dolnym (oznaczenie składnika w basie). Jest to jednak zduplikowanie informacji
            (wiadomo, że jak składnikiem w basie jest septyma, to ta septyma musi być jednocześnie składnikiem
            dodatkowym), dlatego można ukryć wyświetlanie dodatkowego składnika, jeśli jest on już podany jako składnik
            w basie (dla przyspieszenia czytania akordu).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideBaseAdditional}
        onChange={(value) => changeDifficulty({ hideBaseAdditional: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj alternatywne akordy'}
        expansion={
          <>
            <strong>
              C<sup>7&lt;</sup>/e<sup>6&gt;</sup>
            </strong>{' '}
            →{' '}
            <strong>
              C<sup>7&lt;</sup>
            </strong>
          </>
        }
        description={
          <>
            Nierzadko ciężko jest mi się zdecydować, który akord brzmiałby lepiej w danym momencie (szczególnie dla
            piosenek bez oryginalnych wykonań, gdzie po prostu zapisuję akordy, takie jakie są). Aby nie ograniczać
            możliwości wykonania piosenki w różnej harmonii, czasami zapisuję alternatywne akordy po ukośniku, np.{' '}
            <strong>D/h</strong>. Oznacza to, że generalnie gramy D-dur, ale h-moll będzie brzmiał równie dobrze. Jeśli
            jednak nie chcemy sobie zaprzątać głowy alternatywną harmonią, możemy ograniczyć widoczne akordy do jednej
            harmonii.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideAlternatives}
        onChange={(value) => changeDifficulty({ hideAlternatives: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Ukryj kolumnę alternatywnych akordów'}
        description={
          <>
            Czasem dodaję inną harmonię dla całej zwrotki lub nawet piosenki. Wtedy widoczna jest dodatkowa kolumna
            akordów z tąże harmonią. Czasem jest to inna harmonia dla np. powtórzenia refrenu (wynikająca z oryginału)
            lub inna tonacja dla części utworu (np. opcjonalna modulacja ostatniego refrenu).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.hideAlternativesColumn}
        onChange={(value) => changeDifficulty({ hideAlternativesColumn: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Bemole i krzyżyki jako znaki'}
        expansion={
          <>
            <strong>Es Cis</strong> → <strong>E♭ C♯</strong>
          </>
        }
        description={
          <>
            W Polsce przyjęło się zapisywać podwyższenia i obniżenia akordów tak jak się wymawia, np.{' '}
            <strong>Fis</strong>, <strong>As</strong>. Jednak niktórzy praktykują zapis taki jak dźwięki na pięciolini,
            czyli zamiast "-is" mamy krzyżyk <strong>♯</strong>, a zamiast "-es" mamy bemol <strong>♭</strong>.
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.signAccidentals}
        onChange={(value) => changeDifficulty({ signAccidentals: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Zamieniaj enharmonicznie akordy bemolowe'}
        expansion={
          <>
            <strong>Des es</strong> → <strong>Cis dis</strong>
          </>
        }
        description={
          <>
            Zgodnie z zasadami muzyki, to czy użyjemy akordu bemolowego czy krzyżykowego zależy od tego w jakiej
            jesteśmy tonacji. Np. w tonacji <strong>cis-moll</strong> będziemy mieli <strong>Gis</strong>, ale w tonacji{' '}
            <strong>c-moll</strong> już <strong>As</strong>, mimo, że oba te akordy składają się z dokładnie tych samych
            dźwięków. Dla ludzi, którzy nie uczyli się teorii muzyki może wydawać się to bez sensu, a akordy bemolowe
            mogą w ogóle nie istnieć, dlatego można sobie zmienić (bo dla ludzi zaznajomionych z teorią jest z kolei
            odwrotnie i np. ciąg akordów <strong>c Dis</strong> jest niezrozumiały i mylący).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.enharmonicFlats}
        onChange={(value) => changeDifficulty({ enharmonicFlats: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Zamieniaj enharmonicznie akordy krzyżykowe'}
        expansion={
          <>
            <strong>Ais his</strong> → <strong>B c</strong>
          </>
        }
        description={
          <>
            Zgodnie z zasadami muzyki, to czy użyjemy akordu bemolowego czy krzyżykowego zależy od tego w jakiej
            jesteśmy tonacji. Np. w tonacji <strong>gis-moll</strong> będziemy mieli <strong>Ais</strong>, ale w tonacji{' '}
            <strong>c-moll</strong> już <strong>B</strong>, mimo, że oba te akordy składają się z dokładnie tych samych
            dźwięków. Dla ludzi, którzy nie uczyli się teorii muzyki może wydawać się to bez sensu, a akordy takie jak{' '}
            <strong>Ais</strong> w ogóle nie istnieją, dlatego można sobie zmienić (bo dla ludzi zaznajomionych z teorią
            jest z kolei odwrotnie i np. ciąg akordów <strong>gis B</strong> jest niezrozumiały i mylący).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.enharmonicSharps}
        onChange={(value) => changeDifficulty({ enharmonicSharps: value })}
        disabled={disabled}
      />
      <ExpandableSwitch
        label={'Notacja amerykańska'}
        expansion={
          <>
            <strong>H B</strong> → <strong>B B♭</strong>
          </>
        }
        description={
          <>
            Zgodnie z zasadami muzyki, to czy użyjemy akordu bemolowego czy krzyżykowego zależy od tego w jakiej
            jesteśmy tonacji. Np. w tonacji <strong>gis-moll</strong> będziemy mieli <strong>Ais</strong>, ale w tonacji{' '}
            <strong>c-moll</strong> już <strong>B</strong>, mimo, że oba te akordy składają się z dokładnie tych samych
            dźwięków. Dla ludzi, którzy nie uczyli się teorii muzyki może wydawać się to bez sensu, a akordy takie jak{' '}
            <strong>Ais</strong> w ogóle nie istnieją, dlatego można sobie zmienić (bo dla ludzi zaznajomionych z teorią
            jest z kolei odwrotnie i np. ciąg akordów <strong>gis B</strong> jest niezrozumiały i mylący).
          </>
        }
        showDescription={showDescription}
        checked={!!chordDifficulty.americanNotation}
        onChange={(value) => changeDifficulty({ americanNotation: value })}
        disabled={disabled}
      />
    </Stack>
  );
};

export default ChordDifficulty;
