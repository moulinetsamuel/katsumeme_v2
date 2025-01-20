import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { loginSchema } from "@/src/utils/schemas/authSchemas";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJWT } from "@/src/lib/token";
import { findUserByEmail } from "@/src/lib/db";
import { verifyPassword } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const user = await findUserByEmail(validatedData.email);
    if (!user) {
      throw new ApiError("Email ou mot de passe incorrect", 401);
    }

    const isPasswordValid = await verifyPassword({
      password: validatedData.password,
      hashedPassword: user.password_hash,
    });
    if (!isPasswordValid) {
      throw new ApiError("Email ou mot de passe incorrect", 401);
    }

    if (!user.is_verified) {
      throw new ApiError("Compte non vérifié", 401);
    }

    const token = generateJWT({
      userId: user.id,
      role: user.role,
      expiresIn: "1d",
    });

    logger.info(`User ${validatedData.email.split("@")[0]}*** logged in`);
    return NextResponse.json(
      { message: "Connexion réussie", token },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error during login", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Les données fournies sont invalides" },
        { status: 400 }
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        message:
          "Une erreur est survenue lors de la connexion veuillez réessayer",
      },
      { status: 500 }
    );
  }
}
