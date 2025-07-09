import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Импортируем Provider
import {store} from './redux/store'; // Импортируем Redux store
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Оберните App в Provider */}
      <App />
    </Provider>
  </StrictMode>,
);