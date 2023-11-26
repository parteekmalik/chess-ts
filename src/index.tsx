import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Live from "./components/Application";
import Puzzle from "./components/Puzzle/Puzzle";
import Online from "./components/Online/Online";
import Computer from "./components/Computer/Computer";
import Logout from "./components/Logout/Logout";
import RegisterForm from "./components/register/register";
import LoginForm from "./components/Login/Login";
import SocketContextComponent from "./contexts/socket/SocketContextComponent";
import PageContextComponent from "./contexts/page/PageContextComponent";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="logout" element={<Logout />} />
            <Route path="contact" element={<Contact />} />
            <Route
                path="live/:matchid/:userid/:turn"
                element={
                    <SocketContextComponent>
                        <Live />
                    </SocketContextComponent>
                }
            />
            {/* <Route
                path="live/:matchid/:userid"
                element={
                    <SocketContextComponent>
                        <Live />
                    </SocketContextComponent>
                }
            />
            <Route
                path="live/:matchid"
                element={
                    <SocketContextComponent>
                        <Live />
                    </SocketContextComponent>
                }
            /> */}
            <Route path="puzzle" element={<Puzzle />} />
            <Route path="play/online" element={<Online />} />
            <Route path="play/computer" element={<Computer />} />
        </Route>
    )
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <StrictMode>
        <PageContextComponent>
            <RouterProvider router={router} />
        </PageContextComponent>
    </StrictMode>
);
