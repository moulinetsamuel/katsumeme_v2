import { deleteUser, findUserById } from "@/src/lib/db";
import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { verifyJWT } from "@/src/lib/token";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
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

    await deleteUser(user.id);

    logger.info(`Compte supprimé : ${user.email}`);
    return NextResponse.json(
      { message: "Compte supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors de la suppression du compte", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
