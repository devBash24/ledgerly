"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowRight, BarChart3, CreditCard, Package } from 'lucide-react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-indigo-50 dark:from-sky-950 dark:via-gray-950 dark:to-indigo-950 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,rgba(56,189,248,0.1),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,rgba(56,189,248,0.05),transparent)] pointer-events-none" />
      
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
            <div className="space-y-4 max-w-[600px]">
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900 dark:to-indigo-900 text-sm font-medium text-sky-700 dark:text-sky-300">
                Launching Soon 🚀
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-gray-900 dark:text-gray-50">
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Transform Your Business Management
                </span>
              </h1>
              <p className="mx-auto lg:mx-0 max-w-[600px] text-gray-600 dark:text-gray-400 md:text-xl">
                Streamline operations, track finances, and make data-driven decisions with our all-in-one business management platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/signin">
                <Button size="lg" className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg shadow-sky-500/25 dark:shadow-sky-500/10 transition-all duration-200 hover:scale-105">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 dark:text-gray-300 transition-all duration-200">
                  Explore Features
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-800 mt-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">5000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Animation */}
          <div className="relative lg:block">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 dark:from-sky-400/10 dark:to-indigo-400/10 rounded-3xl transform rotate-3 scale-95" />
              <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-10 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900 dark:to-indigo-900 rounded-xl animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse" />
                      <div className="h-20 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection