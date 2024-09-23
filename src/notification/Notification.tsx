import { Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { closeNotification } from '../store/songbook.reducer.ts';

const Notification = () => {
  const notificationState = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  const handleNotificationHide = () => {
    dispatch(closeNotification());
  };

  return (
    <Snackbar
      open={notificationState.open}
      autoHideDuration={2000}
      onClose={handleNotificationHide}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={notificationState.severity} onClose={handleNotificationHide} variant="filled">
        {notificationState.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
