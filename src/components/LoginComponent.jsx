import React, { useState } from "react";
import axios from "axios";
import { useAuth } from '../Context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8085/signin", form); // Adjust port as needed
            console.log(res);
            login(res.data.jwtToken, res.data); // data includes username, roles, userId
            navigate("/"); // Redirect to home or dashboard
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" onChange={handleChange} placeholder="Username" required />
                <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit">Login</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginComponent;
