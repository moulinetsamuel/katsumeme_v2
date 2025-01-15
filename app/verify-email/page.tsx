"use client";

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
  verifyEmail,
} from "@/src/services/authService";
import { ThumbsUp, AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TokenErrorPage from "@/src/components/auth/TokenErrorPage";
import { ApiError } from "@/src/lib/errors";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError("Token manquant");
      setIsLoading(false);
      return;
    }

    const fetchApi = async () => {
      setError(null);
      try {
        const response = await verifyEmail(token);
        setPseudo(response.pseudo);
        setEmail(response.email);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
          if (err.data && err.data.email) {
            setEmail(err.data.email);
          }
        } else {
          setError(
            "Une erreur est survenue lors de la vérification de l'email."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchApi();
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
    } catch (err) {
      if (err instanceof Error) {
        setResendMessage(err.message);
      } else {
        setResendMessage("Une erreur est survenue lors du renvoi de l'email.");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <ThumbsUp className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Vérification en cours...</CardTitle>
            <CardDescription className="text-base">
              Veuillez patienter...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!token || error === "Token manquant" || error === "Token invalide") {
    return <TokenErrorPage />;
  }

  if (error && error.includes("survenue")) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3 text-red-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-500">
              Oups ! Une erreur est survenue
            </CardTitle>
            <CardDescription className="text-base">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button variant="link" onClick={() => router.push("/")}>
              Retour à l&apos;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && error === "Compte déjà vérifié") {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <ThumbsUp className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              Votre email a déjà été vérifié
            </CardTitle>
            <CardDescription className="text-base">
              Vous pouvez maintenant vous connecter avec votre email{" "}
              <span className="font-semibold">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button variant="link" onClick={() => router.push("/")}>
              Retour à l&apos;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-2 text-center">
          {error === "Token expiré" ? (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-red-100 p-3 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-500">
                Votre lien a expiré
              </CardTitle>
              <CardDescription className="text-base">{error}</CardDescription>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <ThumbsUp className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                Votre email a été vérifié avec succès ! 🎉
              </CardTitle>
              <CardDescription className="text-base">
                Bienvenue {pseudo} !
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {error === "Token expiré" ? (
            <>
              <p>Vous pouvez demander un nouvel email de vérification.</p>
              <Button
                disabled={isSending}
                onClick={handleResendEmail}
                className="w-full"
              >
                {isSending ? "Envoi en cours..." : "Renvoyer l'email"}
              </Button>
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
            </>
          ) : (
            <>
              <p>
                Vous pouvez maintenant vous connecter avec votre email{" "}
                <span className="font-semibold">{email}</span>.
              </p>
            </>
          )}
          <Button variant="link" onClick={() => router.push("/")}>
            Retour à l&apos;accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
