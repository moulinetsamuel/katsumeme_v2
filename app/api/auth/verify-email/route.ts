import { findUserByToken, updateUserVerificationStatus } from "@/src/lib/db";
import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token");

    if (!token) {
      throw new ApiError("Token manquant", 400);
    }

    const user = await findUserByToken(token);

    if (!user) {
      throw new ApiError("Token invalide", 400);
    }

    if (user.is_verified) {
      throw new ApiError("Compte déjà vérifié", 400);
    }

    if (user.token_expires_at && user.token_expires_at < new Date()) {
      throw new ApiError<{ email: string }>("Token expiré", 400, {
        email: user.email,
      });
    }

    await updateUserVerificationStatus(user.id);

    logger.info("Email verified successfully:", {
      email: user.email,
      pseudo: user.pseudo,
    });

    return NextResponse.json(
      { email: user.email, pseudo: user.pseudo },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors de la vérification de l'email:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, data: error.data },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la vérification de l'email.",
      },
      { status: 500 }
    );
  }
}
