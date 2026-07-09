"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Satellite, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Platform", href: "#platform" },
    { name: "Research", href: "#research" },
    { name: "Documentation", href: "/docs" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "pt-3 px-4" : "pt-0 px-0"}`}>
      <nav 
        className={`mx-auto max-w-5xl w-full transition-all duration-300 ${
          scrolled 
            ? "rounded-full border bg-ground-950/85 shadow-[0_8px_32px_rgba(0,0,0,0.6)] neon-border-animate" 
            : "border-b border-ground-700/40 bg-ground-950/40"
        } backdrop-blur-md`}
      >
        <div className="px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="rounded-lg p-1.5 border transition-all duration-500 group-hover:rotate-6 shadow-inner neon-logo-animate">
                <Satellite className="h-5 w-5 text-instrument transition-all duration-500 group-hover:rotate-[360deg]" />
              </div>
              <span className="font-display font-medium text-lg tracking-tight text-instrument transition-colors group-hover:text-white">
                Emissia
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative rounded-full px-4 py-1.5 text-sm font-medium text-ground-400 transition-all duration-200 hover:bg-ground-800/60 hover:text-instrument active:scale-[0.97]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/login"
                className="text-sm font-medium text-ground-400 hover:text-instrument transition-colors"
              >
                Watch Demo
              </Link>
              <Link
                href="/signup"
                className="group flex items-center gap-1.5 rounded-full px-4.5 py-2 text-sm font-medium text-ground-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.35)] active:scale-[0.97] neon-btn-animate"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-full p-2 text-ground-400 hover:bg-ground-900 hover:text-instrument focus:outline-none transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="block h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="md:hidden border-t border-ground-700/50 bg-ground-950/95 px-6 py-5 rounded-b-3xl transition-all duration-300" id="mobile-menu">
            <div className="space-y-2 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-ground-400 hover:bg-ground-900 hover:text-instrument transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-ground-700/50 pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-center text-base font-medium text-ground-400 hover:bg-ground-900 hover:text-instrument transition-colors"
              >
                Watch Demo
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block rounded-full bg-instrument py-2.5 text-center text-base font-medium text-ground-950 transition-opacity hover:opacity-90 shadow-lg"
              >
                Start Free
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
