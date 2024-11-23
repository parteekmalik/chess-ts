import React from "react";
import Link from "next/link";
import { auth } from "~/server/auth";
import { twMerge } from "tailwind-merge";

export default async function Header() {
  const session = await auth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/puzzle", label: "Puzzles" },
    { href: "/learn", label: "Learn" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/github", label: "Github" },
  ];

  return (
    <header className="fixed left-0 z-50 h-full bg-background-800 text-white shadow">
      <nav className="border-gray-200 px-4 py-2.5 lg:px-6">
        <div className="flex max-w-screen-xl flex-col items-start justify-between">
          <Link href="/" className="flex self-start">
            <img src="/images/wp.png" className="h-14" alt="Logo" />
            <div className="relative">
              <p className="absolute inset-x-0 bottom-0 text-white">Chess.com</p>
            </div>
          </Link>
          <div className="w-full items-center justify-between lg:order-1" id="mobile-menu-2">
            <ul className="m-5 flex flex-col font-medium text-white">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`my-2 block rounded border-gray-100 bg-gray-400 px-5 text-center text-white duration-200 hover:bg-gray-50 hover:text-orange-700`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center lg:order-2">
              <Link
                href={session?.user ? "/api/auth/signout" : "/api/auth/signin"}
                className={twMerge(
                  "rounded-lg bg-success-300 px-4 py-2 text-sm font-medium text-white hover:bg-success-300 focus:outline-none focus:ring-4 focus:ring-gray-300 lg:px-5 lg:py-2.5",
                  session?.user && "bg-danger-300 hover:bg-danger-300",
                )}
              >
                {session?.user ? "sign out" : "sign in"}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
