"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { AuthModal } from "@/src/components/auth/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {
  // TODO remplacer par un état de connexion avec zustand
  const isLogin = false;

  const [showAuthModal, setShowAuthModal] = useState(false);

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
          {isLogin ? (
            <Link href="/profile">
              <Avatar>
                {/* TODO remplacer par les donné du store User */}
                <AvatarImage src="/avatar.jpg" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
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
