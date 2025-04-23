"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaInfoCircle,
  FaLinkedin,
  FaPuzzlePiece,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export function Header() {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome className="text-xl" /> },
    { href: "/play/puzzle", label: "Puzzles", icon: <FaPuzzlePiece className="text-xl" /> },
    { href: "/play/live", label: "Live", icon: <FaPuzzlePiece className="text-xl" /> },
    { href: "/learn", label: "Learn", icon: <FaBook className="text-xl" /> },
    { href: "/about", label: "About", icon: <FaInfoCircle className="text-xl" /> },
    { href: "/contact", label: "Portfolio", icon: <FaUser className="text-xl" /> },
    { href: "https://www.linkedin.com/in/parteek-malik-0b0907312", label: "Linkedin", icon: <FaLinkedin className="text-xl" /> },
  ];

  return (
    <header className="sticky top-0 z-50 h-screen w-fit bg-background text-foreground shadow-md">
      <nav className="border-gray h-full w-fit border-r px-4 py-3">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between">
          <Link href="/" className="flex items-center text-foreground">
            <Image src="/images/wp.png" alt="Logo" width={48} height={48} />
            <p className={`${isExpanded ? "block text-xl font-bold" : "hidden"} ml-2`}>Chess</p>
          </Link>
          <div className="relative flex w-full items-center justify-between lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col font-medium">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-default-100 hover:bg-default-200 mx-auto flex w-fit items-center justify-center rounded-full p-2 transition duration-200"
              >
                {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
              {navLinks.map((link) => (
                <li key={link.href} className="my-2">
                  <Link
                    href={link.href}
                    className="flex items-center justify-start gap-2 rounded-lg border border-gray-300 bg-card p-3 text-card-foreground shadow-md transition duration-200 hover:shadow-lg"
                  >
                    {link.icon}
                    {isExpanded && <span className="text-lg font-medium">{link.label}</span>}
                  </Link>
                </li>
              ))}
              <Link
                href={session?.user ? "/api/auth/signout" : "/api/auth/signin"}
                className={twMerge(
                  "bg-success-200 mx-auto flex w-full items-center justify-center gap-4 rounded-lg border border-gray-300 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-4",
                  session?.user && "bg-danger hover:bg-danger-600",
                )}
              >
                {isExpanded && <span>{session?.user ? "Sign Out" : "Sign In"}</span>}
                {session?.user ? <FaSignOutAlt className="text-xl" /> : <FaSignInAlt className="text-xl" />}
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
