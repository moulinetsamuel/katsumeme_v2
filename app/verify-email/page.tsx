"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { StatusCard } from "@/src/components/auth/StatusCard";
import TokenErrorPage from "@/src/components/auth/TokenErrorPage";
import { useEmailVerification } from "@/src/hooks/use-email-verification";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const {
    error,
    pseudo,
    email,
    isLoading,
    isSending,
    resendMessage,
    handleResendEmail,
  } = useEmailVerification(token);

  useEffect(() => {
    if (token) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, [token]);

  if (isLoading) {
    return (
      <StatusCard
        title="Vérification en cours..."
        description="Veuillez patienter..."
      />
    );
  }

  if (!token || error === "Token manquant" || error === "Token invalide") {
    return <TokenErrorPage />;
  }

  if (error && error.includes("survenue")) {
    return (
      <StatusCard
        title="Oups ! Une erreur est survenue"
        description={error}
        icon="error"
        titleColor="error"
      >
        <Button variant="link" onClick={() => router.push("/")}>
          Retour à l&apos;accueil
        </Button>
      </StatusCard>
    );
  }

  if (error && error === "Compte déjà vérifié") {
    return (
      <StatusCard
        title="Votre email a déjà été vérifié"
        description={
          <>
            Vous pouvez maintenant vous connecter avec votre email{" "}
            <span className="font-semibold">{email}</span>.
          </>
        }
      >
        <Button variant="link" onClick={() => router.push("/")}>
          Retour à l&apos;accueil
        </Button>
      </StatusCard>
    );
  }

  if (error === "Token expiré") {
    return (
      <StatusCard
        title="Votre lien a expiré"
        description={error}
        icon="error"
        titleColor="error"
      >
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
        <Button variant="link" onClick={() => router.push("/")}>
          Retour à l&apos;accueil
        </Button>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      title="Votre email a été vérifié avec succès ! 🎉"
      description={`Bienvenue ${pseudo} !`}
    >
      <p>
        Vous pouvez maintenant vous connecter avec votre email{" "}
        <span className="font-semibold">{email}</span>.
      </p>
      <Button variant="link" onClick={() => router.push("/")}>
        Retour à l&apos;accueil
      </Button>
    </StatusCard>
  );
}
