"use client"
import Link from "next/link";
import { Button } from "../ui/button";
import { branding } from "@/lib/branding/branding";
import { ThemeToggle } from "../theme-toggle";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SignOutButton, useUser } from "@clerk/nextjs";

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '/contact' },
]

export default function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isSignedIn} = useUser()

  return (
    <header className="fixed w-full z-50">
      <div className="relative">
        {/* Background with blur and subtle gradient */}
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800" />
        
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link className="flex items-center justify-center" href="/">
              <span className="font-bold text-2xl bg-gradient-to-r from-sky-600 to-indigo-500 text-transparent bg-clip-text">
                {branding.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA & Theme */}
            <div className="hidden md:flex items-center gap-x-4">
           {
            isSignedIn ? (
              <>
              
              <SignOutButton>
                <Button variant="ghost" className="font-medium hover:text-sky-600 transition-colors">
                  Sign Out
                </Button>
              </SignOutButton>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>   
              </>
            ) : (
              <>
              <Link href="/sign-in">
                <Button variant="ghost" className="font-medium hover:text-sky-600 transition-colors">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/25">
                  Get Started
                </Button>
              </Link>
              <ThemeToggle />
              </>
            )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="relative bg-white dark:bg-gray-950 shadow-lg border-b border-gray-200 dark:border-gray-800">
              <div className="space-y-1 px-4 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-sky-600 dark:hover:text-sky-400 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4 space-y-2">
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-center bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
