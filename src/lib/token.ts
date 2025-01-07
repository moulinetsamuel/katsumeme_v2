import jwt from "jsonwebtoken";
import crypto from "crypto";

export function generateTemporaryToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  return token;
}

export function generateVerificationToken() {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour
  return { verificationToken, tokenExpiresAt };
}
