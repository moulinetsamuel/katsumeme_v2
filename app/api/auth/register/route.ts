import { createUser } from "@/src/lib/auth";
import { logger } from "@/src/lib/logger";
import { generateTemporaryToken } from "@/src/lib/token";
import { registerBackendSchema } from "@/src/utils/schemas/authSchemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerBackendSchema.parse(body);

    const user = await createUser(validatedData);

    const temporaryToken = generateTemporaryToken(user.id);

    logger.info("User created successfully:", {
      email: user.email,
      pseudo: user.pseudo,
    });

    return NextResponse.json(
      { message: "Inscription réussie", token: temporaryToken },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Erreur lors de l'inscription", error);
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Les données fournies sont invalides" },
        { status: 400 }
      );
    }

    // Erreur d'unicité Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const field = (error.meta?.target as string[])?.[0];
        const message =
          field === "email"
            ? "Cette adresse email est déjà utilisée"
            : "Ce pseudo est déjà utilisé";

        return NextResponse.json({ message }, { status: 409 });
      }
    }

    // Autres erreurs
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
