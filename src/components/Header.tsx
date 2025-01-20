"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { AuthModal } from "@/src/components/auth/AuthModal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useToast } from "@/src/hooks/use-toast";

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  console.log(user?.avatar_url);

  return (
    <>
      <header className="bg-white border-b fixed top-0 left-0 right-0 z-10">
        <div className=" mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logoname.png"
              alt="Katsumeme logo"
              width={180}
              height={180}
            />
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Avatar>
                  <AvatarImage
                    src={user?.avatar_url}
                    alt={`Avatar de ${user?.pseudo}`}
                  />
                  <AvatarFallback>{user?.pseudo.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </Link>
              <Button
                className="bg-katsumeme-purple hover:bg-katsumeme-purple/90 text-white"
                onClick={handleLogout}
              >
                {" "}
                Se déconnecter{" "}
              </Button>
            </div>
          ) : (
            <Button
              className="bg-katsumeme-purple hover:bg-katsumeme-purple/90 text-white"
              onClick={() => setShowAuthModal(true)}
            >
              Se connecter
            </Button>
          )}
        </div>
      </header>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
