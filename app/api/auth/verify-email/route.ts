import { verifyEmail } from "@/src/lib/auth";
import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token manquant" }, { status: 400 });
    }

    const user = await verifyEmail(token);

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
