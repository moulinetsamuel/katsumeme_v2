import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";
import { sendVerificationEmail } from "@/src/lib/email";
import { RegisterBackendData } from "@/src/utils/schemas/authSchemas";
import { generateVerificationToken } from "@/src/lib/token";
import { ApiError } from "@/src/lib/errors";

export async function createUser(data: RegisterBackendData) {
  const now = new Date();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const { verificationToken, tokenExpiresAt } = generateVerificationToken();

  const defaultAvatars = [
    "avatar_default_1.jpeg",
    "avatar_default_2.jpeg",
    "avatar_default_3.jpeg",
    "avatar_default_4.jpeg",
  ];
  const randomAvatar =
    defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  const avatarUrl = `https://${process.env.R2_PUBLIC_URL}/${randomAvatar}`;

  const transaction = await prisma.$transaction(async (prismaTx) => {
    const user = await prismaTx.user.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        pseudo: data.pseudo,
        avatar_url: avatarUrl,
        verification_token: verificationToken,
        token_expires_at: tokenExpiresAt,
        last_email_sent_at: now,
      },
    });

    await sendVerificationEmail(data.email, data.pseudo, verificationToken);

    return user;
  });

  return transaction;
}

export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  if (user.is_verified) {
    throw new Error("Email déjà vérifié");
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

    throw new Error(
      `Veuillez attendre encore ${timeLeft} secondes avant de demander un nouvel email de vérification.`
    );
  }

  const { verificationToken, tokenExpiresAt } = generateVerificationToken();

  const transaction = await prisma.$transaction(async (prismaTx) => {
    const updatedUser = await prismaTx.user.update({
      where: { id: user.id },
      data: {
        verification_token: verificationToken,
        token_expires_at: tokenExpiresAt,
        last_email_sent_at: now,
      },
    });

    await sendVerificationEmail(email, user.pseudo, verificationToken);

    return updatedUser;
  });

  return transaction;
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      verification_token: token,
    },
  });

  if (!user) {
    throw new ApiError("Token invalide");
  }

  if (user.is_verified) {
    throw new ApiError("Compte déjà vérifié");
  }

  if (user.token_expires_at && user.token_expires_at < new Date()) {
    throw new ApiError<{ email: string }>("Token expiré", {
      email: user.email,
    });
  }

  const { email, pseudo } = await prisma.user.update({
    where: { id: user.id },
    data: {
      is_verified: true,
    },
  });

  return { email, pseudo };
}

// TODO: A utiliser dans la route POST /api/auth/login
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.is_verified) {
    throw new Error("Invalid credentials or unverified email");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return { user, token };
}
