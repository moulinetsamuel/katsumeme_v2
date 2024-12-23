import { NextApiRequest, NextApiResponse } from "next";
import { loginUser } from "@/src/lib/auth";
import { z } from "zod";

// TODO: A déplacer dans le fichier types.ts si besoin ailleurs
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { user, token } = await loginUser(email, password);

    // TODO: metre en place un logger de succès
    console.log("User logged in successfully");
    res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // TODO: metre en place un logger d'erreur
      console.error("Invalid input:", error.errors);
      return res
        .status(400)
        .json({ message: "Invalid input", errors: error.errors });
    }

    // TODO: metre en place un logger d'erreur
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
}
