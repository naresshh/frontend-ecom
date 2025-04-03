import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header.jsx';

import HomeComponent from './components/HomeComponent.jsx';
import CartPage from './components/CartComponent.jsx';
import GlobalErrorDisplay from './Context/GlobalErrorDisplay.jsx';

function App() {
  return (  // You need to return JSX
    <Router>
    <Header />
    <GlobalErrorDisplay />
    <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/cart" element={<CartPage />} />
    </Routes>
</Router>
  );
}
export default App
