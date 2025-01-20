import { logger } from "@/src/lib/logger";
import { NextResponse } from "next/server";
import { ApiError } from "@/src/lib/errors";
import { verifyJWT } from "@/src/lib/token";
import { findUserById } from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token");

    if (!token) {
      throw new ApiError("Token manquant", 400);
    }

    const payload = verifyJWT(token);

    const user = await findUserById(payload.userId);

    if (!user) {
      throw new ApiError("Utilisateur non trouvé", 404);
    }

    return NextResponse.json(
      { email: user.email, pseudo: user.pseudo },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors de la vérification du token", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Une erreur est survenue lors de la vérification du token" },
      { status: 500 }
    );
  }
}
