import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { CartProvider } from './components/CartContext.jsx'; 
import HomeComponent from './components/HomeComponent.jsx';
import CartPage from './components/CartComponent.jsx';
import GlobalErrorDisplay from './Context/GlobalErrorDisplay.jsx';
import LoginComponent from './components/LoginComponent.jsx';
import RegisterComponent from './components/RegisterComponent.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderConfirmation from './components/OrderConfirmation.jsx';
import InventoryComponent from './components/AdminInventory.jsx';

function App() {
  return (  // You need to return JSX
    <AuthProvider>
      <CartProvider>
    <Router>
    <Header />
    <GlobalErrorDisplay />
    <Routes>
    <Route path="/" element={
                        // <PrivateRoute>
                            <HomeComponent />
                        // </PrivateRoute>
                    } />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/confirmation" element={<OrderConfirmation />} />
        <Route path="/inventory" element={<InventoryComponent />} />

    </Routes>
</Router>
</CartProvider>
</AuthProvider>
  );
}
export default App
