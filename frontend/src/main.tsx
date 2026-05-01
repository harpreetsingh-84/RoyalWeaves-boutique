import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ShopProvider } from './context/ShopContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ToastProvider>
          <ShopProvider>
            <App />
          </ShopProvider>
        </ToastProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
