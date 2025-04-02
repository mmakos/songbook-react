import './App.css';
import { Provider } from 'react-redux';
import store from './store/songbook.store.ts';
import StoreApp from './StoreApp.tsx';
import './HelloThere.ts';

function App() {
  return (
    <Provider store={store}>
      <StoreApp />
    </Provider>
  );
}

export default App;
