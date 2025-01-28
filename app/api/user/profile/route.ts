import { hashPassword, verifyPassword } from "@/src/lib/auth";
import {
  findUserById,
  updateUserPassword,
  updateUserPseudo,
} from "@/src/lib/db";
import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { verifyJWT } from "@/src/lib/token";
import {
  passwordSchema,
  pseudoSchema,
} from "@/src/utils/schemas/profilSchemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request) {
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

    const body = await req.json();

    if (body.pseudo) {
      const validatedData = pseudoSchema.parse(body);

      const newPseudo = await updateUserPseudo(user.id, validatedData.pseudo);
      logger.info("Pseudo mis a jour", { userId: user.id, newPseudo });
      return NextResponse.json({
        message: "Pseudo mis a jour",
        pseudo: newPseudo,
      });
    }

    const validatedData = passwordSchema.parse(body);
    const isPasswordValid = await verifyPassword({
      password: validatedData.oldPassword,
      hashedPassword: user.password_hash,
    });
    if (!isPasswordValid) {
      throw new ApiError("Ancien mot de passe incorrect", 400);
    }
    const hashedPassword = await hashPassword(validatedData.password);
    await updateUserPassword(user.id, hashedPassword);

    logger.info("Mot de passe mis a jour", { userId: user.id });
    return NextResponse.json({ message: "Mot de passe mis a jour" });
  } catch (error) {
    logger.error("Erreur lors de la mise a jour d'avatar", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Les données fournies sont invalides" },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "Ce pseudo est déjà utilisé" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Erreur lors de la mise a jour du profil" },
      { status: 500 }
    );
  }
}
