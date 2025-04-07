import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const OrderConfirmation = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract order details from location state
  const { address, cartItems } = location.state || {};

  useEffect(() => {
    if (!address || !cartItems) {
      setError("Order details are missing.");
      setIsLoading(false);
      return;
    }

    // Simulate API call to fetch the placed order details if necessary
    const fetchOrderDetails = async () => {
      try {
        // Here you can call the API to get the order details from the backend using the order ID (for example)
        // const response = await axios.get(`/api/orders/${orderId}`);

        // Simulating successful order details response
        const response = {
          data: {
            orderId: 12345, // This should come from the backend
            customerName: address.name,
            address: address,
            items: cartItems,
            totalAmount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
            status: "Placed",
          },
        };

        setOrderDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch order details. Please try again.");
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [address, cartItems]);

  if (isLoading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Order Confirmation</h2>
      <h3>Order ID: {orderDetails.orderId}</h3>
      <h4>Shipping Address:</h4>
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <p><strong>Name:</strong> {orderDetails.customerName}</p>
        <p><strong>Email:</strong> {orderDetails.address.email}</p>
        <p><strong>Phone:</strong> {orderDetails.address.phone}</p>
        <p><strong>Street:</strong> {orderDetails.address.street}</p>
        <p><strong>City:</strong> {orderDetails.address.city}</p>
        <p><strong>State:</strong> {orderDetails.address.state}</p>
        <p><strong>Zip Code:</strong> {orderDetails.address.zipCode}</p>
      </div>

      <h4>Order Items:</h4>
      <ul>
        {orderDetails.items.map((item, index) => (
          <li key={index}>
            <p>{item.productName}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </li>
        ))}
      </ul>

      <h4>Total Amount: ${orderDetails.totalAmount}</h4>

      <h4>Status: {orderDetails.status}</h4>
    </div>
  );
};

export default OrderConfirmation;
