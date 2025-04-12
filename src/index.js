import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // opcional
import App from './App';
import reportWebVitals from './reportWebVitals'; // se estiver usando

// Verifica se há o container com id "root"
const container = document.getElementById('root');
if (!container) {
  throw new Error('Elemento com id "root" não encontrado no index.html');
}
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
