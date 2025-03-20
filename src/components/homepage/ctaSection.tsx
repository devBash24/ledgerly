"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

const benefits = [
  "30-day free trial with full access",
  "No credit card required",
  "Cancel anytime",
  "24/7 priority support"
]

const CTASection = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-sky-50 via-white to-indigo-50 dark:from-sky-950 dark:via-gray-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.1),transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.05),transparent)] pointer-events-none" />
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <div className="space-y-4 max-w-[600px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900 dark:text-gray-50">
                Ready to 
                <span className="bg-gradient-to-r from-sky-600 to-indigo-600 text-transparent bg-clip-text"> Transform </span>
                Your Business?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-lg">
                Join thousands of successful businesses already using our platform to grow and succeed.
              </p>
            </div>

            <div className="space-y-4 w-full">
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg shadow-sky-500/25 dark:shadow-sky-500/10 transition-all duration-200 hover:scale-105">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 dark:text-gray-300">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>

          {/* Testimonial/Stats Card */}
          <div className="relative lg:block">
            <div className="relative w-full max-w-[500px] mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-400 dark:to-indigo-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">Sarah Thompson</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">CEO, TechStart Inc.</div>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-400 italic">
                This platform has completely transformed how we manage our business. The analytics and automation features alone have saved us countless hours.
                </blockquote>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">85%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">3x</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Growth</div>
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

export default CTASection