import { resendVerificationEmail } from "@/src/lib/auth";
import { logger } from "@/src/lib/logger";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await resendVerificationEmail(body.email);

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

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
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
