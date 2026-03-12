"use client";
import { isAuthorized } from "@/lib/isAuthorized";
import Link from "next/link";
import React, { useState } from "react";

function Navbar() {
  const user = isAuthorized();

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="relative z-50 flex justify-center items-center bg-white rounded-2xl shadow-lg border border-gray-200 mx-auto w-full md:w-[90vw] lg:w-[80vw] h-20 mt-6">
      <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-black rounded-lg px-3 py-1">
            OneMinute Support
          </span>
        </Link>

        {/* Desktop Nav + Auth Button on right */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <Link
            href="#features"
            className="px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition font-medium"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition font-medium"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition font-medium"
          >
            Contact
          </Link>
          {!user ? (
            <Link href="/api/auth" className="ml-4">
              <button className="bg-black text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition">
                Sign In
              </button>
            </Link>
          ) : (
            <Link href="/dashboard" className="ml-4">
              <button className="bg-gray-100 text-black px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition">
                Access Dashboard
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white rounded-b-2xl shadow-lg border-t border-gray-200 z-40">
          <div className="px-4 py-4 flex flex-col gap-2 items-center">
            {!user ? (
              <Link href="/api/auth" className="w-full text-center mb-2">
                <button className="bg-black text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition w-full">
                  Sign In
                </button>
              </Link>
            ) : (
              <Link href="/dashboard" className="w-full text-center mb-2">
                <button className="bg-gray-100 text-black px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition w-full">
                  Access Dashboard
                </button>
              </Link>
            )}
            <Link
              href="#features"
              className="w-full text-center px-3 py-2 rounded-lg text-black hover:bg-gray-100 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="w-full text-center px-3 py-2 rounded-lg text-black hover:bg-gray-100 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="w-full text-center px-3 py-2 rounded-lg text-black hover:bg-gray-100 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
