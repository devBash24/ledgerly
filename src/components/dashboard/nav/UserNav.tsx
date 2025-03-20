import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
export function UserNav() {
  return (
    <div className="flex items-center justify-between gap-4">
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
      <ThemeToggle />
    </div>
  );
}
