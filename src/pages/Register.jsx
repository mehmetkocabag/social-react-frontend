import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError("");

        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("/api/v1/users/register", {
                username: username,
                email: email,
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
                setError("Registration failed.");
            }
        } catch (err) {
            setError("Registration failed.");
            console.error(err);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    const handleContinueAnonymously = () => {
        navigate("/feed");
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Create Account</h2>
            {error && <p className="register-error">{error}</p>}

            <div className="register-input-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
            </div>

            <div className="register-input-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="register-input"
                />
            </div>

            <div className="register-input-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
            </div>

            <div className="register-input-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="register-input"
                />
            </div>

            <div className="register-button-group">
                <button onClick={handleRegister} className="register-button">
                    Create Account
                </button>
                <div className="register-secondary-button-group">
                    <button onClick={handleBackToLogin} className="register-secondary-button">
                        Back to Login
                    </button>
                    <button
                        onClick={handleContinueAnonymously}
                        className="register-secondary-button"
                    >
                        Continue Anonymously
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;