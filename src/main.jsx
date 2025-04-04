import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/CartContext.jsx'
import {ErrorProvider} from './Context/ErrorContext.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorProvider>
    <AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
  </AuthProvider>
</ErrorProvider>
)
