import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const ShippingAddress = ({ onAddressSaved }) => {
    const [address, setAddress] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
    });

    const { auth } = useAuth();
    const customerId = auth.userId;
    const token = auth.token;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:8084/api/shipping/${customerId}`, address, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                onAddressSaved(response.data); // Pass saved address to parent
            })
            .catch((error) => {
                alert("Failed to save address");
                console.error(error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Shipping Address</h3>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
            <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
            <input type="text" name="state" placeholder="State" onChange={handleChange} required />
            <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} required />

            <button type="submit" style={{ marginTop: "10px" }}>Save Address</button>
        </form>
    );
};

export default ShippingAddress;
