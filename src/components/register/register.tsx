// src/RegisterForm.js
import React, { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [istaken, setIstaken] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/register/${username}/${password}`);

            if (response.status === 200) {
                navigate("/login");
            }
        } catch (error) {
            setIstaken(true);
        }
    };

    return (
        <>
            register
            <div className="flex flex-col justify-center items-center bg-gray-200 m-auto">
                <input className="m-5" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {istaken && <div className="text-red-800">username is not available(try another)</div>}
                <button className="m-5" onClick={handleRegister}>
                    register
                </button>
            </div>
        </>
    );
};

export default RegisterForm;
