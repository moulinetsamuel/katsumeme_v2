import emailjs from "@emailjs/nodejs";
import { logger } from "@/src/lib/logger";

export async function sendVerificationEmail(
  to: string,
  username: string,
  token: string
) {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: to,
        username: username,
        verification_link: verificationLink,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );
    logger.info("Verification email sent to", {
      email: to,
      username,
      verificationLink,
    });
  } catch (error) {
    throw error;
  }
}
