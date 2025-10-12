import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
            className="h-14 w-auto hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-3 pl-45">
          <Link 
            href="/" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Accueil
          </Link>
          <Link 
            href="/areas" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            Areas
          </Link>
          <Link 
            href="/features" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Fonctionnalités
          </Link>
          <Link 
            href="/pricing" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Tarifs
          </Link>
          <Link 
            href="/integrations" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Intégrations
          </Link>
          <Link 
            href="/templates" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Templates
          </Link>
          <Link 
            href="/docs" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Docs
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Blog
          </Link>
          <Link 
            href="/support" 
            className="text-sm font-medium text-foreground/80 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 transform"
          >
            Support
          </Link>
        </nav>

        {/* Theme Toggle & Auth Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Inscription</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
