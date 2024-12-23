"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useToast } from "@/src/hooks/use-toast";
import { Button } from "@/src/components/ui/button";
import { register } from "@/src/services/authService";
import { useRouter } from "next/navigation";
import { RegisterFormData } from "@/src/utils/schemas/authSchemas";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setIsLogin(true);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const login = useAuthStore((state) => state.login);

  const { toast } = useToast();

  const handleRegister = async (data: RegisterFormData) => {
    const registerData = {
      email: data.email,
      password: data.password,
      pseudo: data.pseudo,
    };

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await register(registerData);
      const params = new URLSearchParams({
        email: data.email,
        pseudo: data.pseudo,
      });
      router.push(`/auth/verify-email?${params.toString()}`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Erreur lors de l'inscription");
      } else {
        setErrorMessage("Erreur lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    // Logique de connexion à implémenter
    // utiliser la fonction login du store pour se connecter
    // dans un try catch et toast si success dans le try et toast error dans le catch
    // pas oublier de bien faire des message d'erreur dans l'api pour pouvoir les afficher dans le toast
    // si son email n'est pas validé lui dire de le valider et proposer de renvoyer un email de validation comment ?
    setIsLoading(true);
    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté",
    });
    console.log("Login attempt:", data);
    onClose();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Connexion" : "Création de compte"}
          </DialogTitle>
        </DialogHeader>
        {isLogin ? (
          <>
            <LoginForm onLogin={handleLogin} isLoading={isLoading} />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Pas encore de compte ?{" "}
              </span>
              <Button
                variant="link"
                className="text-katsumeme-purple p-0"
                onClick={() => setIsLogin(false)}
              >
                S&apos;inscrire
              </Button>
            </div>
          </>
        ) : (
          <>
            <RegisterForm
              onRegister={handleRegister}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <Button
                variant="link"
                className="text-katsumeme-purple p-0"
                onClick={() => setIsLogin(true)}
              >
                Se connecter
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
