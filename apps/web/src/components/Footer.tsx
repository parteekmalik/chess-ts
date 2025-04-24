import Link from "next/link";

export default function Footer() {
  const footerData = {
    resources: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
    ],
    followUs: [
      { name: "Github", href: "https://github.com/parteekmalik", external: true },
      { name: "Discord", href: "/" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" },
    ],
    socialIcons: [
      {
        name: "Facebook",
        href: "#",
        viewBox: "0 0 8 19",
        path: "M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z",
      },
    ],
  };

  return (
    <footer className="bg-background-700 text-background-foreground border-y">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="flex flex-col space-y-6 md:flex-row md:justify-between md:space-y-0">
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="relative flex text-foreground">
              <a
                style={{
                  backgroundPosition: "-2.3em -3.7em",
                }}
                className="chess-icon"
              />
              <p className="ml-2 -translate-x-2 translate-y-1 text-2xl font-bold">Chess.com</p>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {Object.entries(footerData)
              .filter(([key]) => key !== "socialIcons")
              .map(([title, items]) => (
                <div key={title} className="text-center md:text-left">
                  <h2 className="mb-4 text-sm font-semibold uppercase">{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
                  <ul className="font-medium">
                    {items.map((item, index) => (
                      <li key={item.name} className={index !== items.length - 1 ? "mb-3" : ""}>
                        <Link href={item.href} target={item.href.startsWith("http") ? "_blank" : "_self"} className="hover:underline">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <span className="text-center text-sm">
            © 2023
            <a href="https://parteekmalik@github.com/" className="ml-1 hover:underline">
              parteekmalik
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex space-x-5">
            {footerData.socialIcons.map((icon) => (
              <Link key={icon.name} href={icon.href} className="hover:text-gray-600">
                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox={icon.viewBox}>
                  <path fillRule="evenodd" d={icon.path} clipRule="evenodd" />
                </svg>
                <span className="sr-only">{icon.name} page</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
