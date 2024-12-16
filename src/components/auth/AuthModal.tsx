"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { RegisterForm } from "@/src/components/auth/RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLoginForm ? "Connexion" : "Création de compte"}
          </DialogTitle>
        </DialogHeader>
        {isLoginForm ? (
          <LoginForm onRegisterClick={() => setIsLoginForm(false)} />
        ) : (
          <RegisterForm onLoginClick={() => setIsLoginForm(true)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
