import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// Create Context
const CartContext = createContext();

// Define initial state
const initialState = {
    cartItems: [],
};

// Define reducer function for cart actions
const cartReducer = (state, action) => {
    switch (action.type) {
        case "SET_CART":
            return { ...state, cartItems: action.payload || [] };
        case "ADD_TO_CART":
            return { ...state, cartItems: [...state.cartItems, action.payload] };
        case "REMOVE_FROM_CART":
            return { ...state, cartItems: state.cartItems.filter(item => item.productId !== action.payload) };
        case "UPDATE_CART":
            return { 
                ...state, 
                cartItems: state.cartItems.map(item => 
                    item.productId === action.payload.productId ? action.payload : item 
                ) 
            };
        default:
            return state;
    }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Fetch Cart from API on mount
    useEffect(() => {
        axios.get("http://localhost:8082/cart/1")
            .then(response => {
                dispatch({ type: "SET_CART", payload: response.data });
            })
            .catch(error => console.error("Error fetching cart:", error));
    }, []);

    return (
        <CartContext.Provider value={{ cartItems: state.cartItems, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart
export const useCart = () => {
    return useContext(CartContext);
};
