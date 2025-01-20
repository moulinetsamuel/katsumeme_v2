import {
  findUserByEmail,
  UpdateUserWithSendVerificationEmail,
} from "@/src/lib/db";
import { ApiError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { generateVerificationToken } from "@/src/lib/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await findUserByEmail(body.email);

    if (!user) {
      throw new ApiError("Utilisateur non trouvé", 404);
    }

    if (user.is_verified) {
      throw new ApiError("Email déjà vérifié", 400);
    }

    const now = new Date();
    const RESEND_DELAY_MS = 5 * 60 * 1000;
    if (
      user.last_email_sent_at &&
      now.getTime() - user.last_email_sent_at.getTime() < RESEND_DELAY_MS
    ) {
      const timeSinceLastEmail =
        now.getTime() - user.last_email_sent_at.getTime();
      const timeLeft = Math.ceil((RESEND_DELAY_MS - timeSinceLastEmail) / 1000);

      throw new ApiError(
        `Veuillez attendre encore ${timeLeft} secondes avant de demander un nouvel email de vérification.`,
        400
      );
    }

    const { verificationToken, tokenExpiresAt } = generateVerificationToken();

    await UpdateUserWithSendVerificationEmail({
      userId: user.id,
      verificationToken,
      tokenExpiresAt,
    });

    logger.info("Verification email resent successfully:", {
      email: user.email,
      pseudo: user.pseudo,
    });

    return NextResponse.json(
      { message: "Email de vérification renvoyé avec succès !" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors du renvoi d'un email de vérification", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        message:
          "Une erreur est survenue lors du renvoi de l'email de vérification",
      },
      { status: 500 }
    );
  }
}
