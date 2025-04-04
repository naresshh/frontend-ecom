import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import {useAuth} from '../Context/AuthContext.jsx';

// Create Context
const CartContext = createContext();

// Initial state
const initialState = {
    cartItems: [],
};

// Reducer function
const cartReducer = (state, action) => {
    switch (action.type) {
        case "SET_CART":
            return { ...state, cartItems: action.payload || [] };

        case "ADD_TO_CART":
            return { ...state, cartItems: [...state.cartItems, action.payload] };

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.productId !== action.payload),
            };

        case "UPDATE_QUANTITY":
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };

        default:
            return state;
    }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { auth } = useAuth();
    console.log("CartProvider auth:", auth); // Add this log
    // Ensure auth is available and userId is present
    // if (!auth || !auth.userId) {
    //     return <div>Loading...</div>;  // or any fallback UI while auth is being initialized
    // }

    const customerId = auth.userId;

    // Fetch Cart from API on mount
    useEffect(() => {
        const fetchCart = () => {
            axios.get(`http://localhost:8082/cart/${customerId}`) // Adjust customerId dynamically based on user login
                .then(response => dispatch({ type: "SET_CART", payload: response.data }))
                .catch(error => console.error("Error fetching cart:", error));
        };

        fetchCart();
        
        // Optional: Sync across tabs
        window.addEventListener("storage", fetchCart);
        return () => window.removeEventListener("storage", fetchCart);
    }, []);

    return (
        <CartContext.Provider value={{ cartItems: state.cartItems, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    const { cartItems, dispatch } = context;
    const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    return { cartItems, cartQuantity, dispatch };
};
