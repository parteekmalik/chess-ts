import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Live from "./components/LiveBoard/LiveBoard";
import Puzzle from "./components/Puzzle/Puzzle";
import Online from "./components/Online/Online";
import Computer from "./components/Computer/Computer";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="live/:matchid/:userid/:turn" element={<Live />} />
            <Route path="live/:matchid/:userid" element={<Live />} />
            <Route path="live/:matchid" element={<Live />} />
            <Route path="puzzle" element={<Puzzle />} />
            <Route path="play/online" element={<Online />} />
            <Route path="play/computer" element={<Computer />} />
        </Route>
    )
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
