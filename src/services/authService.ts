import { RegisterBackendData } from "@/src/utils/schemas/authSchemas";
import { ApiError } from "@/src/lib/errors";
import { LoginFormData } from "@/src/utils/schemas/authSchemas";

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
      responseData.status,
      responseData.data
    );
  }

  return responseData;
}

export async function login(data: LoginFormData) {
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

export async function fetchUser(token: string) {
  const response = await fetch("/api/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || "Erreur lors de la récupération de l'utilisateur"
    );
  }

  return responseData;
}

export async function fetchUpdateAvatar(token: string, data: FormData) {
  const response = await fetch("/api/user/avatar", {
    method: "PATCH",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || "Erreur lors de la mise à jour de l'avatar"
    );
  }

  return responseData;
}

export async function fetchUpdateProfile(token: string, data: FormData) {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || "Erreur lors de la mise à jour du profil"
    );
  }

  return responseData;
}
