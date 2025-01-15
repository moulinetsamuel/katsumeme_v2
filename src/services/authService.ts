import { User } from "@/src/type";
import { RegisterBackendData } from "@/src/utils/schemas/authSchemas";
import { ApiError } from "@/src/lib/errors";

// TODO: A déplacer dans le fichier types.ts si besoin ailleurs
interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterBackendData) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Erreur lors de l'inscription");
  }

  return responseData;
}

export async function resendVerificationEmail(email: string) {
  const response = await fetch("/api/auth/resend-verification-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message ||
        "Erreur lors de l'envoi de l'email de vérification"
    );
  }

  return responseData;
}

export async function verifyToken(token: string) {
  const response = await fetch(`/api/auth/verify-token?token=${token}`);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Erreur lors de la vérification");
  }

  return responseData;
}

export async function verifyEmail(token: string) {
  const response = await fetch(`/api/auth/verify-email?token=${token}`);

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError<{ email: string }>(
      responseData.message,
      responseData.data
    );
  }

  return responseData;
}

export async function login(
  data: LoginData
): Promise<{ user: User; token: string }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Erreur lors de la connexion");
  }

  return responseData;
}
