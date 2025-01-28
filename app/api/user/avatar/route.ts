import { deleteAvatarFromR2, uploadAvatarToR2 } from "@/src/lib/cloudflareR2";
import { findUserById, updateUserAvatar } from "@/src/lib/db";
import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { verifyJWT } from "@/src/lib/token";
import { prepareUploadAvatarForR2 } from "@/src/lib/utils";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const defaultAvatars = [
    "https://files.katsumeme.com/avatars/avatar_default_1.jpg",
    "https://files.katsumeme.com/avatars/avatar_default_2.jpg",
    "https://files.katsumeme.com/avatars/avatar_default_3.jpg",
    "https://files.katsumeme.com/avatars/avatar_default_4.jpg",
  ];

  let newAvatarUrl: string | null = null;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new ApiError("Token manquant", 401);
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyJWT(token);

    const user = await findUserById(decodedToken.userId);
    if (!user) {
      throw new ApiError("Utilisateur introuvable", 404);
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    if (!file) {
      throw new ApiError("Aucun fichier fourni", 400);
    }

    const { fileName, buffer } = await prepareUploadAvatarForR2(file, user.id);
    newAvatarUrl = await uploadAvatarToR2(fileName, buffer, file.type);

    const updatedUser = await updateUserAvatar({
      userId: user.id,
      newAvatarUrl,
    });

    if (user.avatar_url && !defaultAvatars.includes(user.avatar_url)) {
      const oldFileName = user.avatar_url.split("/").pop();

      if (oldFileName) {
        try {
          await deleteAvatarFromR2(oldFileName);
        } catch (error) {
          logger.error(
            `Erreur lors de la suppression de l'ancien avatar: ${oldFileName}`,
            error
          );
        }
      }
    }

    logger.info(`Avatar mis à jour pour l'utilisateur: ${user.id}`);
    return NextResponse.json(
      { message: "Avatar mis à jour", avatar_url: updatedUser.avatar_url },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors de la mise a jour d'avatar", error);

    if (newAvatarUrl) {
      try {
        const newFileName = newAvatarUrl.split("/").pop();
        if (newFileName) {
          await deleteAvatarFromR2(newFileName);
        }
      } catch (error) {
        logger.error(
          `Erreur lors de la suppression du nouvel avatar: ${newAvatarUrl}`,
          error
        );
      }
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Erreur lors de la mise a jour d'avatar" },
      { status: 500 }
    );
  }
}
