import { PasswordData, PseudoData } from "@/src/utils/schemas/profilSchemas";

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

export async function fetchUpdateProfile(
  token: string,
  data: PseudoData | PasswordData
) {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
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

export async function fetchDeleteUser(token: string) {
  const response = await fetch("/api/user/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || "Erreur lors de la suppression du compte"
    );
  }

  return responseData;
}
