import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b px-6">
        <Link href="/" className="text-lg font-semibold">
          Stater
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  );
}
