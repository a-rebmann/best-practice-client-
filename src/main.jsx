import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@ui5/webcomponents-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App style={{ width: '100%', height: '100%' }}/>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
