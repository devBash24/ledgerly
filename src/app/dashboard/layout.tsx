import { SideNav } from "@/components/dashboard/nav/SideNav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MobileNav } from "@/components/dashboard/nav/MobileNav";
import {  currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ExtendedUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ledgerly VC",
  description: "Track your business orders and expenses",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser()
  if(!user){
    redirect('/sign-in')
  }
  if(!((user as ExtendedUser).publicMetadata.onboardingCompleted === true)){
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen">
      <SideNav />
      <MobileNav />
      <div className="flex-1 flex flex-col md:pl-64">
        <div className="md:hidden h-16" /> {/* Mobile nav spacer */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
