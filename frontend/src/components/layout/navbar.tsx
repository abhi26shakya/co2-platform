"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Satellite, Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "#platform" },
  { name: "Research", href: "#research" },
  { name: "Documentation", href: "/docs" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks
      .filter((l) => l.href.startsWith("#"))
      .map((l) => l.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "pt-3 px-4" : "pt-0 px-0"
      }`}
    >
      <nav
        className={`mx-auto max-w-5xl w-full transition-all duration-300 ${
          scrolled
            ? "glass-strong rounded-full shadow-[0_8px_32px_-8px_var(--shadow-color)] neon-border-animate"
            : "border-b border-ground-700/40 bg-ground-950/40 backdrop-blur-md"
        }`}
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
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = link.href.startsWith("#") && activeHash === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                      isActive
                        ? "text-instrument bg-ground-800/70"
                        : "text-ground-400 hover:bg-ground-800/50 hover:text-instrument"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-sensor/70" aria-hidden />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm font-medium text-ground-400 hover:text-instrument transition-colors"
              >
                Watch Demo
              </Link>
              <Link
                href="/signup"
                className="btn btn-filled group py-2 px-4.5 text-sm"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
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
          <div
            className="md:hidden border-t border-ground-700/50 glass-strong px-6 py-5 rounded-b-3xl transition-all duration-300"
            id="mobile-menu"
          >
            <div className="space-y-1 pb-3">
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
                className="btn btn-filled w-full py-2.5 text-base"
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
