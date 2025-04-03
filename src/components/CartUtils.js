import axios from "axios";

// Common function to update the cart quantity
export const updateCartQuantity = (cartItems, productId, quantity, dispatch, customerId) => {
    const cartItem = cartItems.find(item => item.productId === productId);
    console.log("CartItem found:", cartItem); // Debug log

    if (cartItem) {
        alert('Entering quantity update function');
        console.log("Updating quantity for:", cartItem);
        if (quantity > 0) {
            axios.put(`http://localhost:8082/cart/update/${cartItem.customerId}/${cartItem.productId}?quantity=${quantity}`)
                .then(() => {
                    console.log("Quantity updated successfully");
                    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
                    refreshCart(dispatch, customerId);
                })
                .catch(error => console.error("Error updating quantity:", error));
        } else {
            // If quantity is zero, remove item from cart
            axios.delete(`http://localhost:8082/cart/delete/${cartItem.productId}`)
                .then(() => {
                    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
                    refreshCart(dispatch, customerId);
                })
                .catch(error => console.error("Error removing from cart:", error));
        }
    } else {
        console.log("No matching cart item found for productId:", productId); // Debug log if cartItem is not found
    }
};

const refreshCart = (dispatch, customerId) => {
    axios.get(`http://localhost:8082/cart/${customerId}`)
        .then(response => {
            dispatch({ type: "SET_CART", payload: response.data });
        })
        .catch(error => console.error("Error fetching updated cart:", error));
};
