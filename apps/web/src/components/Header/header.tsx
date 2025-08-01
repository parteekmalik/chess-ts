"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHome, FaLinkedin, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import { cn } from "@acme/ui";
import { Drawer, DrawerContent, DrawerTrigger } from "@acme/ui/drawer";

import { ThemeSwitch } from "./ThemeSwitch";

const iconClassName = "h-[3em] w-[3em] text-[10px]";
const navLinks = [
  { href: "/", label: "Home", icon: <FaHome className={iconClassName} /> },
  { href: "/play/live", label: "Live", icon: "-2.1em -7.8em" },
  { href: "/play/puzzle", label: "Puzzles", icon: "-2.3em -11.4em" },
  { href: "/learn", label: "Learn", icon: "-2.3em -15.15em" },
  { href: "/about", label: "About", icon: "-2.3em -22.65em" },
  { href: "/contact", label: "Portfolio", icon: <FaUser className={iconClassName} /> },
  {
    href: "https://www.linkedin.com/in/parteek-malik-0b0907312",
    label: "Linkedin",
    icon: <FaLinkedin className={iconClassName} />,
  },
];

export function Header() {
  const { data: session } = useSession();

  return (
    <>
      <header className={cn("flex h-fit min-w-full justify-between p-1 lg:hidden")}>
        <div className="flex">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <div className={"font-chess text-2xl dark:text-white/70"}>t</div>
            </DrawerTrigger>
            <DrawerContent isDragLine={false} className="left-0 top-0 w-fit m-0 translate-x-0 translate-y-0 p-0">
              <VerticalHeader />
            </DrawerContent>
          </Drawer>
          <Link href="/" className="relative flex dark:text-white/70">
            <p
              style={{
                backgroundPosition: "-2.3em -3.7em",
              }}
              className="chess-icon"
            />
            <p className="ml-2 -translate-x-4 translate-y-1 text-2xl font-bold">Chess.com</p>
          </Link>
        </div>
        {!session
          ? <Link
            href="/api/auth/signin"
            className="bg-primary flex w-fit items-center ml-auto justify-center gap-4 rounded-lg px-2 text-sm font-medium focus:outline-none focus:ring-4"
          >
            <span>Sign In</span>
            <FaSignInAlt className="text-xl" />
          </Link>
          :
          <div className="ml-auto flex font-chess text-3xl dark:text-white/70">
            <Link href={"/play/live"}>
              Ἐ
            </Link>
            <div>&#121;</div>
            <div>&#113;</div>
            <div>&#183;</div>
          </div>}
      </header>
      <VerticalHeader className="sticky top-0 z-50 hidden lg:block" />
    </>
  );
}

function VerticalHeader({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <header className={cn("h-screen w-fit bg-background dark:text-white dark:text-card-foreground shadow-md", className)}>
      <nav className="border-gray flex h-full w-fit flex-col justify-between border-r px-1 py-3">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center">
          <Link href="/" className="flex items-center px-2">
            <p
              style={{
                backgroundPosition: "-2.3em -3.7em",
              }}
              className="chess-icon"
            />
            <p className={`${isExpanded ? "block text-xl font-bold" : "hidden"} ml-2`}>Chess.com</p>
          </Link>
          <ul className="flex w-full flex-col font-medium my-4" id="mobile-menu-2">
            {navLinks.map((link) => (
              <li key={link.href} className="my-2 px-2">
                <Link
                  href={link.href}
                  className="flex items-center justify-start gap-2 rounded-lg shadow-md transition duration-200 hover:shadow-lg"
                >
                  {typeof link.icon === "string" ? <div className="chess-icon" style={{ backgroundPosition: link.icon }} /> : link.icon}
                  {isExpanded && <span className="text-lg font-medium">{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={session?.user ? "/api/auth/signout" : "/api/auth/signin"}
            className={twMerge(
              "bg-success-200 mx-auto flex w-full items-center justify-center gap-4 rounded-lg border border-gray-300 py-3 text-sm font-medium focus:outline-none focus:ring-4",
              session?.user ? "bg-destructive hover:bg-destructive/70" : "bg-primary",
              !isExpanded && "py-1 px-0 aspect-square"
            )}
          >
            {isExpanded && <span>{session?.user ? "Sign Out" : "Sign In"}</span>}
            {session?.user ? <FaSignOutAlt className="text-xl" /> : <FaSignInAlt className="text-xl" />}
          </Link>
        </div>
        <div className="mx-auto mb-14">
          <ThemeSwitch className="mx-auto" />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-default-100 hover:bg-default-200 flex w-full items-center justify-center rounded-full p-2 transition duration-200"
          >
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
      </nav>
    </header>
  );
}
