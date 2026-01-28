"use client";

import {
  faBars,
  faMapMarkerAlt,
  faShoppingCart,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/menu" },
    { name: "Special Offers", href: "/offers" },
    { name: "Restaurants", href: "/restaurants" },
    { name: "Track Order", href: "/track" },
  ];

  const cartItemCount = 23;
  const cartTotal = 79.89;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Banner */}
      <div className="bg-black text-white py-2 px-4 lg:px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span>🎉 Get 5% Off your first order,</span>
            <a
              href="/promo"
              className="text-orange-500 underline font-semibold hover:text-orange-400"
            >
              Promo: ORDER5
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="w-3.5 h-3.5 text-orange-500"
            />
            <span>Regent Street, A4, A4201, London</span>
            <a href="#" className="text-orange-500 hover:underline ml-1">
              Change Location
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold">
            <span className="text-gray-900">Crave</span>
            <span className="text-orange-500">x</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-2xl transition-all ${
                  activeNav === link.name
                    ? "bg-orange-500 text-white"
                    : "text-gray-900 hover:text-orange-500"
                }`}
                onClick={() => setActiveNav(link.name)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-2xl transition-all"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                <span className="text-sm font-semibold hidden sm:inline">
                  {cartItemCount} Items
                </span>
              </div>
              <span className="text-sm font-semibold pl-2 border-l border-white/30 hidden sm:inline">
                GBP {cartTotal.toFixed(2)}
              </span>
            </Link>

            {/* Login/Signup */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl transition-all text-sm font-semibold"
            >
              <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login/Signup</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-2xl text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`py-3 border-b border-gray-100 text-base font-medium ${
                  activeNav === link.name
                    ? "text-orange-500 font-semibold"
                    : "text-gray-900"
                }`}
                onClick={() => {
                  setActiveNav(link.name);
                  setIsMobileMenuOpen(false);
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 py-3 bg-green-700 text-white rounded-2xl font-semibold"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>
                {cartItemCount} Items - GBP {cartTotal.toFixed(2)}
              </span>
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl font-semibold"
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Login/Signup</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
