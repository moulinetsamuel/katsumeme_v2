import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";
import { sendVerificationEmail } from "@/src/lib/email";
import { RegisterBackendData } from "@/src/utils/schemas/authSchemas";

export async function createUser(data: RegisterBackendData) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

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
      },
    });

    await sendVerificationEmail(data.email, data.pseudo, verificationToken);

    return user;
  });

  return transaction;
}

// TODO: A utiliser dans la route GET /api/auth/verify-email
export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      verification_token: token,
      token_expires_at: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      is_verified: true,
      verification_token: null,
      token_expires_at: null,
    },
  });

  return user;
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

// TODO: A utiliser dans la route POST /api/auth/forgot-password ?
// export function verifyToken(token: string) {
//   try {
//     return jwt.verify(token, JWT_SECRET) as {
//       userId: string;
//       email: string;
//       role: string;
//     };
//   } catch (error) {
//     throw new Error("Invalid token");
//   }
// }
