import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="shadow fixed z-50 left-0 text-gray-800  h-full">
            <nav className=" border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-col flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex ">
                        <img src="http://localhost:5173/src/assets/images/wp.png" className="h-14" alt="Logo" />
                        {/* <div className="relative">
                            <p className=" text-4xl absolute inset-x-0 bottom-0 ">Chess.com</p>
                        </div> */}
                    </Link>
                    <div className="flex flex-col items-center lg:order-2">
                        {!sessionStorage.getItem("username") && <Link
                            to="/login"
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Log in
                        </Link>}
                        <Link
                            to={`${sessionStorage.getItem("username") ? "/logout" : "/register"}`}
                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            {sessionStorage.getItem("username") ? "logout" : "register"}
                        </Link>
                    </div>
                    <div className="justify-between items-center w-full  lg:order-1" id="mobile-menu-2">
                        <ul className="flex flex-col m-5  text-white font-medium ">
                            <li>
                                <NavLink
                                    to="/"
                                    className={`block bg-gray-400 text-center rounded px-5 duration-200 text-white my-2 border-gray-100 hover:bg-gray-50  hover:text-orange-700 `}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/puzzle"
                                    className={`block bg-gray-400 text-center rounded px-5 duration-200 text-white my-2 border-gray-100 hover:bg-gray-50  hover:text-orange-700 `}
                                >
                                    Puzzles
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/learn"
                                    className={`block bg-gray-400 text-center rounded px-5 duration-200 text-white my-2 border-gray-100 hover:bg-gray-50  hover:text-orange-700 `}
                                >
                                    Learn
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={`block bg-gray-400 text-center rounded px-5 duration-200 text-white my-2 border-gray-100 hover:bg-gray-50  hover:text-orange-700 `}
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={`block bg-gray-400 text-center rounded px-5 duration-200 text-white my-2 border-gray-100 hover:bg-gray-50  hover:text-orange-700 `}
                                >
                                    Contact
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/github"
                                    className={`block bg-gray-400 text-center rounded px-5 duration-200 text-white my-2 border-gray-100 hover:bg-gray-50  hover:text-orange-700 `}
                                >
                                    Github
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
