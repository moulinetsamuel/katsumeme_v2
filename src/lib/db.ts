import prisma from "@/src/lib/prisma";
import { sendVerificationEmail } from "@/src/lib/email";
import { deleteAvatarFromR2 } from "@/src/lib/cloudflareR2";
import { logger } from "@/src/lib/logger";

const defaultAvatars = [
  "https://files.katsumeme.com/avatars/avatar_default_1.jpg",
  "https://files.katsumeme.com/avatars/avatar_default_2.jpg",
  "https://files.katsumeme.com/avatars/avatar_default_3.jpg",
  "https://files.katsumeme.com/avatars/avatar_default_4.jpg",
];

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

export async function findUserByToken(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      verification_token: token,
    },
  });

  return user;
}

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}

interface CreateUserOptions {
  email: string;
  pseudo: string;
  password: string;
  avatarUrl: string;
  verificationToken: string;
  tokenExpiresAt: Date;
}
export async function createUserWithSendVerificationEmail(
  options: CreateUserOptions
) {
  const now = new Date();
  const {
    email,
    pseudo,
    password,
    avatarUrl,
    verificationToken,
    tokenExpiresAt,
  } = options;

  const transaction = await prisma.$transaction(async (prismaTx) => {
    const user = await prismaTx.user.create({
      data: {
        email: email,
        password_hash: password,
        pseudo,
        avatar_url: avatarUrl,
        verification_token: verificationToken,
        token_expires_at: tokenExpiresAt,
        last_email_sent_at: now,
      },
    });

    await sendVerificationEmail({
      to_email: email,
      username: pseudo,
      verification_link: verificationToken,
    });

    return user;
  });

  return transaction;
}

interface UpdateUserOptions {
  userId: string;
  verificationToken: string;
  tokenExpiresAt: Date;
}
export async function UpdateUserWithSendVerificationEmail(
  options: UpdateUserOptions
) {
  const now = new Date();
  const { userId, verificationToken, tokenExpiresAt } = options;

  const transaction = await prisma.$transaction(async (prismaTx) => {
    const user = await prismaTx.user.update({
      where: { id: userId },
      data: {
        verification_token: verificationToken,
        token_expires_at: tokenExpiresAt,
        last_email_sent_at: now,
      },
    });

    await sendVerificationEmail({
      to_email: user.email,
      username: user.pseudo,
      verification_link: verificationToken,
    });

    return user;
  });

  return transaction;
}

export async function updateUserVerificationStatus(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      is_verified: true,
    },
  });

  return user;
}

interface UpdateUserAvatarOptions {
  userId: string;
  newAvatarUrl: string;
}
export async function updateUserAvatar(options: UpdateUserAvatarOptions) {
  const { userId, newAvatarUrl } = options;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      avatar_url: newAvatarUrl,
    },
  });

  return user;
}

export async function updateUserPassword(userId: string, newPassword: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      password_hash: newPassword,
    },
  });
}

export async function updateUserPseudo(userId: string, newPseudo: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      pseudo: newPseudo,
    },
  });

  return user.pseudo;
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.delete({
    where: { id: userId },
  });

  if (user.avatar_url && !defaultAvatars.includes(user.avatar_url)) {
    const oldFileName = user.avatar_url.split("/").pop();

    if (oldFileName) {
      try {
        await deleteAvatarFromR2(oldFileName);
      } catch (error) {
        logger.error(
          `Erreur lors de la suppression de l'avatar: ${oldFileName}`,
          error
        );
      }
    }
  }

  return user;
}
