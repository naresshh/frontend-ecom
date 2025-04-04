import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        enabled: true,
        roles: ["ROLE_USER"]
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8085/api/users/create", form);
            navigate("/login");
        } catch (err) {
            alert("Registration failed: " + err.response.data);
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" onChange={handleChange} placeholder="Username" required />
                <input name="email" onChange={handleChange} placeholder="Email" required />
                <input name="phone" onChange={handleChange} placeholder="Phone" required />
                <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterComponent;
