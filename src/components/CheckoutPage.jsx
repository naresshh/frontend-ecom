import React, { useState } from "react";
import ShippingAddress from "./ShippingAddress";
import { useCart } from "./CartContext"; 
import { useNavigate } from "react-router-dom";

import axios from "axios";

const CheckoutPage = () => {
    const { cartItems, dispatch } = useCart(); 
  const [savedAddress, setSavedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const navigate = useNavigate();

  // Function to place the order
  const placeOrder = async () => {
    if (!savedAddress) {
      alert("Please enter a shipping address.");
      return;
    }

    try {
      setIsLoading(true);

      // Assuming JWT token is saved in localStorage (adjust according to your actual implementation)
      const jwtToken = localStorage.getItem("token");
      
      if (!jwtToken) {
        alert("User not authenticated. Please login.");
        navigate("/login"); // Redirect to login if JWT is missing
        return;
      }

      // Assuming customerId is available from the app's context or a global state
      const customerId = 2; // Replace this with the actual customerId

      // Send the request to place the order (no need to pass address or cartItems in the request)
      const response = await axios.post(
        `http://localhost:8084/api/orders/place/${customerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        
        setOrderConfirmation(response.data);
        alert("Order placed successfully!");
        dispatch({ type: "CLEAR_CART" });
        // Optionally, redirect to an order confirmation page
        navigate(`/order/confirmation`, { state: { address: savedAddress, cartItems } });
        //navigate(`/order/${response.data.id}`);
      } else {
        alert("Order placement failed.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <ShippingAddress onAddressSaved={setSavedAddress} />
      <br />

      {savedAddress && (
        <>
          <h4>Saved Address:</h4>
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <p><strong>Name:</strong> {savedAddress.name}</p>
            <p><strong>Email:</strong> {savedAddress.email}</p>
            <p><strong>Phone:</strong> {savedAddress.phone}</p>
            <p><strong>Street:</strong> {savedAddress.street}</p>
            <p><strong>City:</strong> {savedAddress.city}</p>
            <p><strong>State:</strong> {savedAddress.state}</p>
            <p><strong>Zip Code:</strong> {savedAddress.zipCode}</p>
          </div>

          <button onClick={placeOrder} disabled={isLoading} style={{ marginTop: "10px" }}>
            {isLoading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
