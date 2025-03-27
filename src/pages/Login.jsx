import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("/api/v1/users/login", {
                username: username,
                password: password
            });

            const { userId } = response.data;
            const { userName } = response.data;
            const { userEmail } = response.data;

            if (userId) {
                localStorage.clear()
                localStorage.setItem("userId", userId);
                localStorage.setItem("userName", userName);
                localStorage.setItem("userEmail", userEmail);
                navigate("/feed");
            } else {
                setError("Login failed. Please check your username and password.");
            }
        } catch (err) {
            setError("Incorrect credentials. Please try again.");
            console.error(err);
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleContinueAnonymously = () => {
        navigate("/feed");
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {error && <p className="login-error">{error}</p>}
            <div className="login-input-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
            </div>
            <div className="login-input-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
            </div>
            <div className="login-button-group">
                <button onClick={handleLogin} className="login-button">
                    Login Now
                </button>
                <div className="login-secondary-button-group">
                    <button onClick={handleRegister} className="login-secondary-button">
                        Register
                    </button>
                    <button
                        onClick={handleContinueAnonymously}
                        className="login-secondary-button"
                    >
                        Continue Anonymously
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;