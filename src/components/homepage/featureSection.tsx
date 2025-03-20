"use client"
import { BarChart3, CreditCard, Package, Users, Globe, Shield, Zap, Clock, ArrowUpRight } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const features = [
  {
    icon: Package,
    title: "Order Management",
    description: "Track and manage orders efficiently with real-time updates and smart notifications.",
    color: "sky",
    link: "/features/orders"
  },
  {
    icon: CreditCard,
    title: "Expense Tracking",
    description: "Monitor expenses with automatic categorization and detailed financial insights.",
    color: "blue",
    link: "/features/expenses"
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Make data-driven decisions with comprehensive analytics and custom reports.",
    color: "indigo",
    link: "/features/analytics"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team through real-time updates and role-based access.",
    color: "cyan",
    link: "/features/team"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Expand your business globally with multi-currency and language support.",
    color: "teal",
    link: "/features/global"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Keep your data safe with enterprise-grade security and compliance features.",
    color: "blue",
    link: "/features/security"
  }
]

const FeatureSection = () => {
  return (
    <section id="features" className="w-full py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="container relative px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900 dark:text-gray-100">
            Powerful Features for Your
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 text-transparent bg-clip-text"> Business Growth</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-lg">
            Everything you need to manage and scale your business, all in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link href={feature.link} key={index}>
              <div className={`group relative overflow-hidden rounded-3xl bg-${feature.color}-50/10 dark:bg-${feature.color}-950/10 p-8 transition-all hover:shadow-2xl hover:shadow-${feature.color}-500/25 hover:-translate-y-1 border border-${feature.color}-100/20 dark:border-${feature.color}-700/20`}>
                <div className="space-y-4">
                  <div className={`inline-block rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/50 p-3`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    <ArrowUpRight className={`h-5 w-5 text-${feature.color}-600 dark:text-${feature.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-${feature.color}-500/10 dark:bg-${feature.color}-400/10`} />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/features">
            <Button size="lg" variant="outline" className="border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950 dark:text-gray-300">
              View All Features <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection