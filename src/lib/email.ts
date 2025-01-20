import emailjs from "@emailjs/nodejs";
import { logger } from "@/src/lib/logger";

interface EmailOptions {
  to_email: string;
  username: string;
  verification_link: string;
}

export async function sendVerificationEmail(options: EmailOptions) {
  const { to_email, username, verification_link } = options;
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verification_link}`;

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email,
        username,
        verification_link: verificationLink,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );
    logger.info("Verification email sent to", {
      email: to_email,
      username,
      verificationLink,
    });
  } catch (error) {
    throw error;
  }
}
