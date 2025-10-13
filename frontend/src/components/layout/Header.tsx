"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings, CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

function Navbar() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="flex items-center gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Accueil</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1"> <Settings className="h-4 w-4" /> Areas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/areas"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      Mes Areas
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Liste de vos Areas, que vous pouvez créer, modifier ou supprimer.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/areas" title="Mes Areas">
                Liste de vos Areas, que vous pouvez créer, modifier ou supprimer.
              </ListItem>
              <ListItem href="/integrations" title="Intégrations">
                Connectez tous vos outils favoris. Voir les services supportés et les nouvelles intégrations.
              </ListItem>
              <ListItem href="/templates" title="Templates">
                Automatisations pré-construites par notre communauté. Installez et personnalisez en quelques clics.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1"> About Areas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/areas"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      Docs
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Tout ce que vous devez savoir pour maîtriser AREA. Guides, tutoriels et exemples pour automatiser votre quotidien.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Docs">
                Tout ce que vous devez savoir pour maîtriser AREA.
              </ListItem>
              <ListItem href="/features" title="Fonctionnalités">
                Découvrez toutes les fonctionnalités qui font d'AREA une plateforme facile à utiliser et complète.
              </ListItem>
              <ListItem href="/pricing" title="Tarifs">
                Choisissez le plan qui correspond à vos besoins.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Support</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/support">Support</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/docs">Documentation</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/blog">Blog</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/aboutus">About us</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

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
        <Navbar />

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
