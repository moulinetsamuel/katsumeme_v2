"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useToast } from "@/src/hooks/use-toast";
import { Button } from "@/src/components/ui/button";
import { register, resendVerificationEmail } from "@/src/services/authService";
import {
  RegisterBackendData,
  RegisterFormData,
  ResendFormData,
} from "@/src/utils/schemas/authSchemas";
import { ResendForm } from "@/src/components/auth/ResendForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [formType, setFormType] = useState<"login" | "register" | "resend">(
    "login"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setFormType("login");
      setErrorMessage(null);
    }
  }, [isOpen]);

  const login = useAuthStore((state) => state.login);

  const { toast } = useToast();

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    const dataWithoutConfirmPassword: RegisterBackendData = {
      email: data.email,
      password: data.password,
      pseudo: data.pseudo,
    };

    try {
      const result = await register(dataWithoutConfirmPassword);
      router.push(`/welcome?token=${result.token}`);
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

  const handleResend = async (data: ResendFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await resendVerificationEmail(data.email);
      toast({
        title: "Email envoyé",
        description: result.message,
      });
      setFormType("login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Erreur lors de l'envoi de l'email de validation"
        );
      } else {
        setErrorMessage("Erreur inconnue, veuillez réessayer.");
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
            {formType === "login" && "Connexion"}
            {formType === "register" && "Inscription"}
            {formType === "resend" && "Renvoyer l'email de validation"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {formType === "login" && "Connectez-vous à votre compte"}
            {formType === "register" && "Créez votre compte"}
            {formType === "resend" &&
              "Entrez votre email pour recevoir un nouveau lien de validation"}
          </DialogDescription>
        </DialogHeader>
        {formType === "login" && (
          <>
            <LoginForm onLogin={handleLogin} isLoading={isLoading} />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Pas encore de compte ?{" "}
              </span>
              <Button
                variant="link"
                className="text-katsumeme-purple p-0"
                onClick={() => setFormType("register")}
              >
                S&apos;inscrire
              </Button>
            </div>
            <div className="text-center text-sm">
              <Button
                variant="link"
                className="text-katsumeme-purple p-0"
                onClick={() => setFormType("resend")}
              >
                Renvoyer l&apos;email de validation
              </Button>
            </div>
          </>
        )}

        {formType === "register" && (
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
                onClick={() => setFormType("login")}
              >
                Se connecter
              </Button>
            </div>
          </>
        )}

        {formType === "resend" && (
          <>
            <ResendForm
              onResend={handleResend}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Retour à la connexion ?{" "}
              </span>
              <Button
                variant="link"
                className="text-katsumeme-purple p-0"
                onClick={() => setFormType("login")}
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
