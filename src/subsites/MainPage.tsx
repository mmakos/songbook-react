import {
  Avatar,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import {
  AccountCircle,
  CasinoOutlined,
  EditNote,
  FormatListNumbered,
  InfoOutlined,
  Language,
  MenuBook,
  MusicNote,
  Piano,
  SentimentVerySatisfied,
  Settings,
  ThumbUp,
  YouTube,
} from '@mui/icons-material';
import FirePlace from '../components/icon/FirePlace.tsx';
import Logo from '../components/icon/Logo.tsx';
import RouteLink from '../components/RouteLink.tsx';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import RouteButton from '../components/RouteButton.tsx';
import useRandomSong from '../store/useRandomSong.hook.ts';

const MainPage = () => {
  const theme = useTheme();
  const randomSong = useRandomSong();

  return (
    <div>
      <Grid container spacing={2} mb="2em">
        <Grid size={{ xs: 12, sm: 4 }}>
          <RouteButton to="/songs" variant="contained" startIcon={<MusicNote />} fullWidth>
            Piosenki
          </RouteButton>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button onClick={() => randomSong()} variant="outlined" startIcon={<CasinoOutlined />} fullWidth>
            Losuj piosenkę
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <RouteButton to="/settings" variant="outlined" startIcon={<Settings />} fullWidth>
            Ustawienia
          </RouteButton>
        </Grid>
      </Grid>
      <Divider>
        <Typography variant="h4">Historia śpiewnika</Typography>
      </Divider>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
            2005 - 2015
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary" variant="outlined">
              <FirePlace />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Obozy
            </Typography>
            <Typography>
              Jako dziecko jeżdżę na obozy{' '}
              <Link href="https://przymierze.org.pl/" underline="hover" target="_blank" rel="noopener">
                Przymierza Rodzin
              </Link>
              , gdzie uczę się grać na gitarze oraz poznaję mnóstwo piosenek
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            2015
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
              <MenuBook />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Śpiewnik papierowy
            </Typography>
            <Typography>
              Zakładam własną grupę i tworzę{' '}
              <Link href="https://mmakos.pl/spiewnik" underline="hover" target="_blank" rel="noopener">
                śpiewnik papierowy
              </Link>
              , gdzie zbieram wszystkie znane mi piosenki
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            2022
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary" variant="outlined">
              <Language />
            </TimelineDot>
            <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Śpiewnik online
            </Typography>
            <Typography>
              Tworzę{' '}
              <Link href="https://spiewnik.mmakos.pl/" underline="hover" target="_blank" rel="noopener">
                pierwszy śpiewnik online
              </Link>
              , generowany automatycznie na podstawie śpiewnika papierowego
            </Typography>
            <Typography variant="body2" color="text.secondary" mt="0.2em">
              Zawiera te same piosenki w tych samych opracowaniach
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            2024
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
            <TimelineDot color="primary">
              <Logo fontSize="large" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Nowy śpiewnik
            </Typography>
            <Typography>
              Wraz z rozwojem zawodowym tworzę{' '}
              <RouteLink to="/" underline="hover">
                nowy śpiewnik online
              </RouteLink>{' '}
              korzystając z najnowszych technologii
            </Typography>
            <Typography variant="body2" color="text.secondary" mt="0.2em">
              Piosenki pojawiają się niezależnie od śpiewnika papierowego
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>

      <Divider sx={{ mb: '2em' }} />

      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5">Kluczowe funkcjonalności</Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <SentimentVerySatisfied />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Dostosowanie akordów" secondary="Tonacja, trudność, składniki" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <Settings />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Dostosowanie piosenki" secondary="Ciemny/jasny, czcionka, styl" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <InfoOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Autorzy i zespoły" secondary="Piosenki autora, informacje" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <YouTube />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Nagrania" secondary="Wybrane nagrania z YouTube" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <SearchIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Wyszukiwanie" secondary="Po tytułach oraz w tekście" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <CasinoOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Losowanie" />
            </ListItem>
          </List>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5">Plany na przyszłość</Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Obsługa użytkowników" secondary="Ustawienia, dodatkowe opcje" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <EditNote />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Dodawanie piosenek" secondary="Dodawanie, edycja i weryfikacja" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FormatListNumbered />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Śpiewanki" secondary="Kolejka piosenek" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <MenuBook />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Generowanie śpiewnika" secondary="Eksport piosenek do docx" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Piano />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Diagramy akordów" secondary="Po najechaniu na symbol" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ThumbUp />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Licznik wyświetleń" />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
