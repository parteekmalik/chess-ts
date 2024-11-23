"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";
import { Link } from "@nextui-org/react";
import {
  FaHome,
  FaPuzzlePiece,
  FaBook,
  FaInfoCircle,
  FaUser,
  FaLinkedin,
  FaChevronRight,
  FaChevronLeft,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Header() {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome className="text-xl" /> },
    { href: "/puzzle", label: "Puzzles", icon: <FaPuzzlePiece className="text-xl" /> },
    { href: "/live", label: "Live", icon: <FaPuzzlePiece className="text-xl" /> },
    { href: "/learn", label: "Learn", icon: <FaBook className="text-xl" /> },
    { href: "/about", label: "About", icon: <FaInfoCircle className="text-xl" /> },
    { href: "/contact", label: "Portfolio", icon: <FaUser className="text-xl" /> },
    { href: "https://www.linkedin.com/in/parteek-malik-0b0907312", label: "Linkedin", icon: <FaLinkedin className="text-xl" /> },
  ];

  return (
    <header className="bg-background text-foreground shadow">
      <nav className="border-default-200 px-1 py-2.5">
        <div className="flex max-w-screen-xl flex-col items-start justify-between">
          <Link href="/" className="flex items-end self-center text-foreground lg:self-start">
            <Image src="/images/wp.png" alt="Logo" width={48} height={48} />
            <p className={`${isExpanded ? "block text-large" : "hidden"}`}>Chess</p>
          </Link>
          <div className="relative w-full items-center justify-between lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col font-medium">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center rounded-full bg-default-100 p-2 hover:bg-default-200"
              >
                {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    isExternal={link.href.startsWith("http")}
                    className="my-2 flex w-full items-center justify-start rounded border-default-200 bg-background-700 px-5 py-2 text-foreground duration-200 hover:bg-default-200"
                  >
                    {link.icon}
                    {isExpanded && <span className="ml-2">{link.label}</span>}
                  </Link>
                </li>
              ))}
              <Link
                href={session?.user ? "/api/auth/signout" : "/api/auth/signin"}
                className={twMerge(
                  "w-full gap-4 rounded-lg bg-success-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-success-600 focus:outline-none focus:ring-4 focus:ring-default-300 lg:px-5 lg:py-2.5",
                  session?.user && "bg-danger hover:bg-danger-600",
                )}
              >
                {isExpanded && <span>{session?.user ? "sign out" : "sign in"}</span>}
                {session?.user ? <FaSignOutAlt className="text-xl" /> : <FaSignInAlt className="text-xl" />}
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
