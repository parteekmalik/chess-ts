import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Online() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    const handleSubmit = (e:any) => {
        e.preventDefault();
        // localStorage.setItem("userName", userName);
        navigate("/live/12345/1/w");
    };
    return (
        <form className="home__container" onSubmit={handleSubmit}>
            <h2 className="home__header">Sign in to Open Chat</h2>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                className="username__input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button className="home__cta">SIGN IN</button>
        </form>
    );
}

export default Online;
