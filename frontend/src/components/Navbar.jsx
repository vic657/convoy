import React, { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <nav className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <i className="fi fi-rr-hand-holding-heart text-[#EA580C] text-[1.4rem]"></i>
          <span className="font-extrabold text-xl tracking-tight text-[#1F2937]">
            Convoy <span className="text-[#EA580C]">of Hope</span>
          </span>
        </a>

        {/* Desktop Navlinks */}
        <ul className="hidden md:flex flex-row items-center space-x-10 text-[1rem] font-semibold text-gray-800">
          {[
            { href: "#impact", label: "Impact" },
            { href: "#features", label: "Features" },
            { href: "#donate", label: "Donate" },
            { href: "#volunteer", label: "Volunteer" },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="hover:text-[#EA580C] transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger (mobile only) */}
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700"
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white shadow-inner">
          <ul className="flex flex-col gap-3 px-4 py-3 text-gray-800 font-semibold">
            {[
              { href: "#impact", label: "Impact" },
              { href: "#features", label: "Features" },
              { href: "#donate", label: "Donate" },
              { href: "#volunteer", label: "Volunteer" },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
