"use client";

import TokenErrorPage from "@/src/components/auth/TokenErrorPage";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  resendVerificationEmail,
  verifyToken,
} from "@/src/services/authService";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token manquant");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await verifyToken(token);
        setPseudo(response.pseudo);
        setEmail(response.email);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Erreur lors de la vérification du token");
        }
      }
    };
    fetchUserData();
  }, [token]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsSending(true);
    setResendMessage(null);

    try {
      const response = await resendVerificationEmail(email);
      setResendMessage(
        response.message || "Email de vérification renvoyé avec succès !"
      );
    } catch (error) {
      if (error instanceof Error) {
        setResendMessage(error.message);
      } else {
        setResendMessage("Une erreur est survenue lors du renvoi de l'email.");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (error) {
    return <TokenErrorPage />;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
          <CardDescription className="text-base">
            Bienvenue {pseudo} !
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Nous avons envoyé un email de vérification à{" "}
            <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Si vous ne trouvez pas l&apos;email, veuillez vérifier votre dossier
            spam. Le lien de vérification expirera dans 1 heures.
          </p>

          {/* Bouton pour renvoyer l'email */}
          <Button onClick={handleResendEmail} disabled={isSending}>
            {isSending ? "Envoi en cours..." : "Renvoyer l'email"}
          </Button>

          {/* Message de succès ou d'erreur */}
          {resendMessage && (
            <p
              className={`text-sm ${
                resendMessage.includes("succès")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {resendMessage}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
