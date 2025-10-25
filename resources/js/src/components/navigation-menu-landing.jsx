import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Menu, X, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function MenuBarNavigation() {
  const [open, setOpen] = useState(false);
  const { setCartOpen } = useCart();
  const { props } = usePage();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="w-full bg-[var(--forest-green)] px-8 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-white text-2xl lato-regular-italic"
      >
        <img
          src='/assets/logo.jfif'
          alt="Salad Treats Logo"
          className="w-8 h-8 rounded-full"
        />
        Salad Treats
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white text-lg font-medium hover:underline transition"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="text-white focus:outline-none"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-16 right-4 bg-[var(--forest-green)] rounded-lg shadow-lg py-4 px-6 flex flex-col gap-3 md:hidden z-50 w-48">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-white text-base hover:bg-green-700 rounded-md px-3 py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
