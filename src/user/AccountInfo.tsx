import { Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { Close, Edit, SaveOutlined } from '@mui/icons-material';
import { FormEvent, useEffect, useRef, useState } from 'react';
import useAuthAPI from '../http/useAuthAPI.ts';
import { notifyError, notifySuccess, setAccessToken, setUser } from '../store/songbook.reducer.ts';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom';

const AccountInfo = () => {
  const user = useAppSelector((state) => state.user);
  const [username, setUsername] = useState(user?.username);
  const [usernameError, setUsernameError] = useState<string>();
  const [edit, setEdit] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const { authAPI } = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(user?.username);
  }, [user]);

  if (user === undefined) return;
  if (!user) return <Navigate to="/login" />;

  const handleChangeUsername = (event: FormEvent) => {
    event.preventDefault();
    if (!username || !edit) return;
    if (username.length < 3) {
      setUsernameError('Nazwa użytkownika musi mieć przynajmniej 3 znaki');
    } else if (username.length > 50) {
      setUsernameError('Nazwa użytkownika może mieć maksymalnie 50 znaków');
    } else if (!RegExp(/^[\w+-.@]+$/).test(username)) {
      setUsernameError('Nazwa użytkownika może zawierać jedynie litery, cyfry i znaki: ._+-@');
    } else {
      setEdit(false);
      setUsernameError(undefined);
      authAPI
        .put('auth/account/username/', { username: username })
        .then((response: AxiosResponse<{ username: string }>) => {
          dispatch(setUser({ ...user, username: response.data.username }));
          dispatch(notifySuccess('Pomyślnie zaktualizowano nazwę użytkownika'));
        })
        .catch(() => {
          handleEdit();
          setUsernameError('Nazwa użytkownika już istnieje.');
          dispatch(notifyError('Nie udało się zaktualizować nazwy użytkownika'));
        });
    }
  };

  const handleLogOut = () => {
    dispatch(setUser(null));
    dispatch(setAccessToken(undefined));
    authAPI
      .post('auth/logout/', undefined, { withCredentials: true })
      .then(() => {
        dispatch(notifySuccess('Zostałeś poprawnie wylogowany'));
        navigate('/login');
      })
      .catch(() => 'Niespodziewany błąd podczas wylogowywania');
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setUsernameError(undefined);
    setUsername(user.username);
  };

  const handleEdit = () => {
    setEdit(true);
    setTimeout(() => usernameInputRef.current?.select(), 0);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Cześć {user.firstName}</Typography>
      <form onSubmit={handleChangeUsername}>
        <TextField
          inputRef={usernameInputRef}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {edit ? (
                    <>
                      <IconButton type="submit">
                        <SaveOutlined />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit}>
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={handleEdit}>
                      <Edit />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              readOnly: !edit,
            },
          }}
          label="Nazwa użytkownika"
          helperText={usernameError ?? 'Widoczna dla wszystkich'}
          error={!!usernameError}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </form>
      <TextField slotProps={{ input: { readOnly: true } }} label="Imię" value={user.firstName} />
      <TextField slotProps={{ input: { readOnly: true } }} label="Nazwisko" value={user.lastName} />
      <TextField slotProps={{ input: { readOnly: true } }} label="Adres mailowy" value={user.email} />
      <Button variant="outlined" size="large" onClick={handleLogOut}>
        Wyloguj
      </Button>
    </Stack>
  );
};

export default AccountInfo;
