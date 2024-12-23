import { NextApiRequest, NextApiResponse } from "next";
import { verifyEmail } from "@//src/lib/auth";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    await verifyEmail(token);

    // TODO: metre en place un logger de succès
    console.log("Email verified successfully");
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    // TODO: metre en place un logger d'erreur
    console.error("Email verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
}
