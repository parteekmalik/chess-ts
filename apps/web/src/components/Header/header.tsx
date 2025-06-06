"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaChevronLeft, FaChevronRight, FaHome, FaLinkedin, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import { cn } from "@acme/ui";
import { Dialog, DialogContent, DialogTrigger } from "@acme/ui/dialog";

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
  return (
    <>
      <header className={cn("flex h-fit min-w-full justify-between p-1 lg:hidden")}>
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <div className={"font-[chess-font] text-2xl"}>t</div>
            </DialogTrigger>
            <DialogContent isCloseHidden className="left-0 top-0 w-fit translate-x-0 translate-y-0 p-0">
              <VerticalHeader />
            </DialogContent>
          </Dialog>
          <Link href="/" className="relative flex text-foreground">
            <p
              style={{
                backgroundPosition: "-2.3em -3.7em",
              }}
              className="chess-icon"
            />
            <p className="ml-2 -translate-x-4 translate-y-1 text-2xl font-bold">Chess.com</p>
          </Link>
        </div>
        <div className="ml-auto flex">
          <Link className={"font-[chess-font] text-xl"} href={"/play/live"}>
            Ἐ
          </Link>
          <div className={"font-[chess-font] text-xl"}>&#121;</div>
          <div className={"font-[chess-font] text-xl"}>&#113;</div>
          <div className={"font-[chess-font] text-xl"}>&#183;</div>
        </div>
      </header>
      <VerticalHeader className="sticky top-0 z-50 hidden md:block" />
    </>
  );
}

function VerticalHeader({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <header className={cn("h-screen w-fit bg-background text-foreground shadow-md", className)}>
      <nav className="border-gray flex h-full w-fit flex-col justify-between border-r bg-white/5 px-4 py-3">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center">
          <Link href="/" className="flex items-center text-foreground">
            <p
              style={{
                backgroundPosition: "-2.3em -3.7em",
              }}
              className="chess-icon"
            />
            <p className={`${isExpanded ? "block text-xl font-bold" : "hidden"} ml-2`}>Chess.com</p>
          </Link>
          <ul className="flex w-full flex-col font-medium" id="mobile-menu-2">
            {navLinks.map((link) => (
              <li key={link.href} className="my-2">
                <Link
                  href={link.href}
                  className="flex items-center justify-start gap-2 rounded-lg bg-card p-3 text-card-foreground shadow-md transition duration-200 hover:shadow-lg"
                >
                  {typeof link.icon === "string" ? <div className="chess-icon" style={{ backgroundPosition: link.icon }} /> : link.icon}
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
