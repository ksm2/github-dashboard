import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { OctokitProvider } from './OctokitProvider.js';

ReactDOM.render(
  <React.StrictMode>
    <OctokitProvider>
      <App />
    </OctokitProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
