import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link, usePage, router } from "@inertiajs/react";
import { Menu, X, LogOut, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function MenuBarNavigation({ mobile = false }) {
  const [open, setOpen] = useState(false);
  const { auth } = usePage().props;

  const handleLogout = () => {
    router.post("/logout", {
      onSuccess: () => router.visit("/login"),
    });
  };

  const delivery_nav = [
    { href: "/d/deliveries", label: "Delivery Orders" },
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
          <div className="absolute right-0 mt-2 bg-[var(--forest-green)] shadow-lg rounded-lg py-2 w-44 z-50">
            {delivery_nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-white text-base lato-regular-italic px-4 py-2 hover:bg-green-700 transition"
              >
                {link.label}
              </Link>
            ))}

            <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block text-white text-base lato-regular-italic px-4 py-2 hover:bg-green-700 transition"
              >
              {auth.user.name}
            </Link>      
            <div className="border-t border-green-700 my-1" />

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
        {delivery_nav.map((link) => (
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

        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white text-lg lato-regular-italic transition-none bg-transparent px-3 hover:underline">
                Account
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href="/account"
                >
                  {auth.user.name}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2" size={16} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}
