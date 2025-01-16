import { useState, useEffect } from "react";
import {
  verifyEmail,
  resendVerificationEmail,
} from "@/src/services/authService";
import { ApiError } from "@/src/lib/errors";

interface VerificationState {
  error: string | null;
  pseudo: string | null;
  email: string | null;
  isLoading: boolean;
  isSending: boolean;
  resendMessage: string | null;
}

export function useEmailVerification(token: string | null) {
  const [state, setState] = useState<VerificationState>({
    error: null,
    pseudo: null,
    email: null,
    isLoading: true,
    isSending: false,
    resendMessage: null,
  });

  useEffect(() => {
    if (!token) {
      setState((prev) => ({
        ...prev,
        error: "Token manquant",
        isLoading: false,
      }));
      return;
    }

    const verifyEmailToken = async () => {
      try {
        const response = await verifyEmail(token);
        setState((prev) => ({
          ...prev,
          pseudo: response.pseudo,
          email: response.email,
          isLoading: false,
        }));
      } catch (err) {
        if (err instanceof ApiError) {
          setState((prev) => ({
            ...prev,
            error: err.message,
            email: err.data?.email || null,
            isLoading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error:
              "Une erreur est survenue lors de la vérification de l'email.",
            isLoading: false,
          }));
        }
      }
    };

    verifyEmailToken();
  }, [token]);

  const handleResendEmail = async () => {
    if (!state.email) return;

    setState((prev) => ({ ...prev, isSending: true, resendMessage: null }));

    try {
      const response = await resendVerificationEmail(state.email);
      setState((prev) => ({
        ...prev,
        resendMessage:
          response.message || "Email de vérification renvoyé avec succès !",
        isSending: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        resendMessage:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du renvoi de l'email.",
        isSending: false,
      }));
    }
  };

  return { ...state, handleResendEmail };
}
