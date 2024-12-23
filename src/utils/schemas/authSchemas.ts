import { z } from "zod";

const baseSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .trim(),
  pseudo: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères")
    .max(30, "Le pseudo ne doit pas dépasser 30 caractères")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Le pseudo ne peut contenir que des lettres, chiffres, - et _"
    )
    .trim(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /[A-Z]/,
      "Le mot de passe doit contenir au moins une lettre majuscule"
    )
    .regex(
      /[a-z]/,
      "Le mot de passe doit contenir au moins une lettre minuscule"
    )
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    )
    .trim(),
  confirmPassword: z.string(),
});

export const registerFormSchema = baseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
);

export const registerBackendSchema = baseSchema.omit({
  confirmPassword: true,
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type RegisterBackendData = z.infer<typeof registerBackendSchema>;
