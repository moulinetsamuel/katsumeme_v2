import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import crypto from "crypto";
import { ApiError } from "@/src/lib/errors";

interface TokenOptions {
  userId: string;
  expiresIn: string;
  role?: string;
}

export function generateJWT(options: TokenOptions) {
  const { userId, expiresIn, role } = options;

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn });
}

export function verifyJWT(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ApiError("Token invalide", 401);
    }
    if (error instanceof TokenExpiredError) {
      throw new ApiError("Token expiré", 401);
    }
    throw error;
  }
}

export function generateVerificationToken() {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour
  return { verificationToken, tokenExpiresAt };
}
