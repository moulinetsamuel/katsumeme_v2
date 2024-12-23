import { User } from "@/src/type";
import { RegisterBackendData } from "@/src/utils/schemas/authSchemas";

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

  return responseData.message;
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
