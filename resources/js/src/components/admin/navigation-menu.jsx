import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "@inertiajs/react";
import { Menu, X, LogOut } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function MenuBarNavigation({ mobile = false }) {
  const [open, setOpen] = useState(false);
  const { auth } = usePage().props;

  const handleLogout = () => {
    router.post("/logout", {
      onSuccess: () => {
        router.visit("/login"); // redirect to login after logout
      },
    });
  };

  const owner_nav = [
    { href: "/owner/orders", label: "Orders" },
    { href: "/owner/tracker", label: "Tracker" },
    { href: "/owner/inventory", label: "Inventory" },
    { href: "/owner/menu", label: "Menu" },
    { href: "/owner/feedback", label: "Feedback" },
    { href: "/owner/account", label: "Account" },
  ];

  const customer_nav = [
    { href: "/customer/orders", label: "Orders" },
    { href: "/customer/tracker", label: "Tracker" },
    { href: "/customer/inventory", label: "Inventory" },
    { href: "/customer/menu", label: "Menu" },
    { href: "/customer/feedback", label: "Feedback" },
    { href: "/customer/account", label: "Account" },
  ];

  const links =
    auth?.user?.role === "Owner"
      ? owner_nav
      : auth?.user?.role === "Customer"
      ? customer_nav
      : [];

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
          <div className="absolute right-0 mt-2 bg-[var(--forest-green)] shadow-lg rounded-lg py-2 w-44 z-50">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-white text-base lato-regular-italic px-4 py-2 hover:bg-green-700 transition"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-green-700 my-1" />

            {/* Logout link */}
            <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 text-white text-base lato-regular-italic px-4 py-2 hover:bg-green-700 transition w-full text-left"
              >
                <LogOut size={18} />
                Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center space-x-2">
        {links.map((link) => (
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

        {/* Logout (desktop) */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <button
              onClick={handleLogout}
              className="text-white text-lg lato-regular-italic px-3 hover:underline flex items-center gap-1"
            >
              <LogOut size={18} />
              Logout
            </button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
