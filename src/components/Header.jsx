import React from 'react';
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

function Header() {
    const { cartItems } = useCart();
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
      <div>Organic-Estore</div>
      <nav>
                <Link to="/">Home</Link>
                <Link to="/cart">
                    🛒 Cart ({cartItems.length})
                </Link>
            </nav>
    </header>
  );
}

export default Header;