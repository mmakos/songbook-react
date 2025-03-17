import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const LogIn = () => {
  return (
    <GoogleOAuthProvider clientId="452813825360-bfofpierh0mq150mohjp9ecfbmtenolb.apps.googleusercontent.com">
      <GoogleLogin onSuccess={(e) => console.log('LOGGED', e)} theme='filled_black' />
    </GoogleOAuthProvider>
  );
};

export default LogIn;
