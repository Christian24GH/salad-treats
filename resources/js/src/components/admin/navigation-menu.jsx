import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react";

export default function MenuBarNavigation({ mobile = false }) {
  const [open, setOpen] = useState(false);

  const adminlinks = [
    { href: "/owner/orders", label: "Orders" },
    { href: "/owner/tracker", label: "Tracker" },
    { href: "/owner/inventory", label: "Inventory" },
    { href: "/owner/menu", label: "Menu" },
    { href: "/owner/feedback", label: "Feedback" },
    { href: "/owner/account", label: "Account" },
  ];

  if (mobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-white flex items-center justify-center w-10 h-10"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-[var(--forest-green)] shadow-lg rounded-lg py-2 w-40 z-50">
            {adminlinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-white text-base lato-regular-italic px-4 py-2 hover:bg-green-700 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop navigation
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center space-x-2">
        {adminlinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                className="text-white text-lg lato-regular-italic transition-none bg-transparent px-3 hover:underline"
                href={link.href}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
