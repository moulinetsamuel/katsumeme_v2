import { logger } from "@/src/lib/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token manquant" }, { status: 400 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (
      typeof payload === "object" &&
      payload !== null &&
      "userId" in payload
    ) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
      });

      if (user) {
        return NextResponse.json({
          email: user.email,
          pseudo: user.pseudo,
        });
      } else {
        return NextResponse.json(
          { message: "Utilisateur non trouvé." },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Le lien est invalide." },
        { status: 400 }
      );
    }
  } catch (error) {
    logger.error("Erreur lors de la vérification du token", error);
    return NextResponse.json(
      { message: "Le lien est invalide ou expiré." },
      { status: 400 }
    );
  }
}
