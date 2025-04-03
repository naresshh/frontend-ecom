import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/CartContext.jsx'
import {ErrorProvider} from './Context/ErrorContext.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorProvider>
  <CartProvider>
    <App />
  </CartProvider>
</ErrorProvider>
)
