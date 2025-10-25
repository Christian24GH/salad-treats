import MenuBarNavigation from '@/components/navigation-menu-landing';

import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5FFF9] text-[var(--forest-green)]">
      <MenuBarNavigation />

      {/*Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 md:px-16 py-16 w-full">
        {/* Left side: text */}
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            It’s more than a salad, it’s a lifestyle
          </h1>
          <p className="text-lg text-gray-700">
            Our salads aren’t just meals, they’re a fresh, easy way to live well every day.
          </p>
          <a
            href="/landing-menu"
            className="inline-block mt-4 bg-[#FFCE42] text-[var(--forest-green)] font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition"
          >
            EXPLORE OUR MENU
          </a>
        </div>

        {/* Right side: image */}
        <div className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2">
          <img
            //src={saladBowl}
            alt="Salad Bowl"
            className="w-[320px] md:w-[400px] object-contain drop-shadow-lg"
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[var(--forest-green)] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Logo */}
          <div>
            <img
              src='/assets/logo.jfif'
              alt="Salad Treats Logo"
              className="w-20 h-20 mb-3"
            />
            <h2 className="text-lg font-semibold">Salad Treats</h2>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p>@Mary Jean Tayamora Liaso</p>
            <p>0917-303-9849</p>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
            <p>@Salad Treats</p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="hover:text-[#FFCE42] transition">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-[#FFCE42] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-[#FFCE42] transition">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="mb-2">
              <a href="#" className="hover:text-[#FFCE42]">FAQs</a>
            </p>
            <p>
              388 3rd St. Kalayaan B. <br />
              Batasan Hills, Quezon City
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="text-center text-xs mt-6 border-t border-white/20 pt-4">
          © {new Date().getFullYear()} Salad Treats — All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
