import React, { useState } from 'react';
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import '../css/Header.css'; // Import CSS
import { useAuth } from "../Context/AuthContext.jsx";

function Header() {
    //const { cartItems } = useCart();
    const { cartQuantity } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth, logout } = useAuth();

    return (
        <header className="header">
            <div className="logo">Organic-Estore</div>

            {/* Hamburger Menu (Mobile) */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            <nav className={menuOpen ? "nav-menu open" : "nav-menu"}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)}>🛒 Cart ({cartQuantity})</Link>
                {auth.isAuthenticated ? (
                    <>
                        <span>Welcome, {auth.user}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
                </>
                 )}
            </nav>
        </header>
    );
}

export default Header;
