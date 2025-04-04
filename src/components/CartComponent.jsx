import React, { useEffect, useState } from "react";
import { useCart } from './CartContext';
import { updateCartQuantity } from './CartUtils.js';
import { useError } from '../Context/ErrorContext.jsx';
import {useAuth} from '../Context/AuthContext.jsx';

import axios from "axios";

const CartComponent = () => {
    const { cartItems, dispatch } = useCart();
    const [message, setMessage] = useState("");
    const { setError } = useError(); 
    const { auth } = useAuth();
    const customerId = auth.userId;

    // **Handle Remove from Cart**
    const removeFromCart = (productId, productTitle) => {
        axios.delete(`http://localhost:8082/cart/delete/${productId}`)
            .then(() => {
                setMessage(`${productTitle} removed from cart!`);
                dispatch({ type: "REMOVE_FROM_CART", payload: productId });
                refreshCart();
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    // Show specific error from backend globally
                    setError(error.response.data.message);
                } else {
                    // If the error response doesn't contain a message, show a generic error
                    setError("Something went wrong while removing from cart.");
                }
            });
    };

    // **Refresh Cart after Removing Item**
    const refreshCart = () => {
        axios.get(`http://localhost:8082/cart/${customerId}`) // Use dynamic customerId
            .then(response => dispatch({ type: "SET_CART", payload: response.data }))
            .catch(error => {
                if (error.response && error.response.data) {
                    // Show specific error from backend globally
                    setError(error.response.data.message);
                } else {
                    // If the error response doesn't contain a message, show a generic error
                    setError("Something went wrong while refreshing the cart.");
                }
            });
    };

    // Use the common utility function to increase or decrease the quantity
    const increaseQuantity = (productId, quantity) => {
        updateCartQuantity(cartItems, productId, quantity + 1, dispatch, customerId);
    };

    const decreaseQuantity = (productId, quantity) => {
        updateCartQuantity(cartItems, productId, quantity - 1, dispatch, customerId);
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Clear success message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={`${item.productId}-${index}`}>
                            {item.productName} - Rs.{item.price} x {item.quantity}

                            {/* Quantity Control */}
                            <button onClick={() => decreaseQuantity(item.productId, item.quantity)}>
                                -
                            </button>
                            <span> {item.quantity} </span>
                            <button onClick={() => increaseQuantity(item.productId, item.quantity)}>
                                +
                            </button>

                            {/* Remove Item */}
                            <button onClick={() => removeFromCart(item.id, item.productName)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

{cartItems.length > 0 && (
                <div>
                    <h3>Total Price: Rs.{calculateTotalPrice()}</h3>
                </div>
            )}

            {/* Success Message */}
            {message && <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>}
        </div>
    );
};

export default CartComponent;
