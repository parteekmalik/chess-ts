// src/LoginForm.js
import React, { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [loginError, setLoginError] = useState(false);

    const handleLogin = async () => {
        try {
            console.log(username, password);
            const response = await axios.get(`http://localhost:3002/login/${username}/${password}`);

            if (response.status === 200) {
                // Save the username to sessionStorage on successful login
                sessionStorage.setItem("username", username);
                navigate("/");
            }
        } catch (error) {
            setLoginError(true);
        }
    };

    return (
        <>
            login
            <div className="flex flex-col justify-center items-center bg-gray-200 m-auto">
                <input className="m-5" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {loginError && <div className="text-red-800">username or password is incorrect</div>}
                <button className="m-5" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </>
    );
};

export default LoginForm;
