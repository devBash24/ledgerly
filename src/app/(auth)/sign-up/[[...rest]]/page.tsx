"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          {/* <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Ledgerly Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </div> */}
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-base text-muted-foreground">
            to continue to Ledgerly
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <SignUp 
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              rootBox: "w-full",
              card: "bg-background shadow-none border rounded-lg p-6",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-background border hover:bg-muted text-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerAction: "pb-0",
              dividerLine: "bg-border",
              dividerText: "bg-background text-muted-foreground",
              formFieldInput: "bg-background text-foreground",
              formFieldLabel: "text-foreground",
              formFieldHintText: "text-muted-foreground",
              formFieldErrorText: "text-destructive",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/90",
              formResendCodeLink: "text-primary hover:text-primary/90",
              alert: "bg-background border text-foreground",
              alertText: "text-foreground",
              socialButtonsProviderIcon: "text-foreground",
              socialButtonsBlockButtonText: "text-foreground",
            },
          }}
          redirectUrl="/onboarding"
          signInUrl="/sign-in"
        />

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a 
            href="/sign-in" 
            className="text-primary hover:text-primary/90 font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
