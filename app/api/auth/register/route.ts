import { hashPassword } from "@/src/lib/auth";
import { createUserWithSendVerificationEmail } from "@/src/lib/db";
import { logger } from "@/src/lib/logger";
import { generateJWT, generateVerificationToken } from "@/src/lib/token";
import { registerBackendSchema } from "@/src/utils/schemas/authSchemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerBackendSchema.parse(body);

    const defaultAvatars = [
      "avatar_default_1.jpg",
      "avatar_default_2.jpg",
      "avatar_default_3.jpg",
      "avatar_default_4.jpg",
    ];
    const randomAvatar =
      defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    const avatarUrl = `https://${process.env.R2_PUBLIC_URL}/avatars/${randomAvatar}`;

    const hashedPassword = await hashPassword(validatedData.password);
    const { verificationToken, tokenExpiresAt } = generateVerificationToken();

    const user = await createUserWithSendVerificationEmail({
      avatarUrl,
      email: validatedData.email,
      pseudo: validatedData.pseudo,
      password: hashedPassword,
      verificationToken,
      tokenExpiresAt,
    });

    const temporaryToken = generateJWT({
      userId: user.id,
      expiresIn: "15m",
    });

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

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Les données fournies sont invalides" },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
