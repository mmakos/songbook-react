import './App.css';
import { Provider } from 'react-redux';
import store from './store/songbook.store.ts';
import StoreApp from './StoreApp.tsx';
import './HelloThere.ts';
import { AuthApiContextProvider } from './http/AuthApiContext.tsx';

function App() {
  return (
    <Provider store={store}>
      <AuthApiContextProvider>
        <StoreApp />
      </AuthApiContextProvider>
    </Provider>
  );
}

export default App;
