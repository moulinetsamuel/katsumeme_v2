import { verifyJWT } from "@/src/lib/token";
import { NextResponse } from "next/server";
import { logger } from "@/src/lib/logger";
import { ApiError } from "@/src/lib/errors";
import { findUserById } from "@/src/lib/db";

export async function GET(req: Request) {
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

    const userInfo = {
      id: user.id,
      email: user.email,
      pseudo: user.pseudo,
      role: user.role,
      avatar_url: user.avatar_url,
      createdAt: user.created_at,
    };

    logger.info(`User ${user.email} retrieved`);
    return NextResponse.json({ user: userInfo }, { status: 200 });
  } catch (error) {
    logger.error("Erreur lors de la récupération des informations", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Erreur lors de la récupération des informations" },
      { status: 500 }
    );
  }
}
