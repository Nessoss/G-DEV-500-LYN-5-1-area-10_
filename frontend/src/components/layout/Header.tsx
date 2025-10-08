import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/smallLogo.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-14 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 pl-25">
          <Link 
            href="/" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Accueil
          </Link>
          <Link 
            href="/areas" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            Mes Areas
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
