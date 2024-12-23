"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mail, User, Lock } from "lucide-react";
import { ErrorFormMessage } from "@/src/components/ErrorFormMessage";
import {
  RegisterFormData,
  registerFormSchema,
} from "@/src/utils/schemas/authSchemas";

interface RegisterFormProps {
  onRegister: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function RegisterForm({
  onRegister,
  isLoading,
  errorMessage,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
      {/* Champ Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="exemple@email.com"
            aria-invalid={!!errors.email}
            className="pl-10"
          />
        </div>
        <ErrorFormMessage message={errors.email?.message} />
      </div>

      {/* Champ Pseudo */}
      <div className="space-y-2">
        <Label htmlFor="pseudo" className="font-medium">
          Pseudo
        </Label>
        <div className="relative">
          <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="pseudo"
            type="text"
            {...register("pseudo")}
            placeholder="Votre pseudo"
            aria-invalid={!!errors.pseudo}
            className="pl-10"
          />
        </div>
        <ErrorFormMessage message={errors.pseudo?.message} />
      </div>

      {/* Champ Mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="password" className="font-medium">
          Mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Mot de passe"
            aria-invalid={!!errors.password}
            className="pl-10"
          />
        </div>
        <ErrorFormMessage message={errors.password?.message} />
      </div>

      {/* Champ Confirmation mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-medium">
          Confirmez le mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirmez le mot de passe"
            aria-invalid={!!errors.confirmPassword}
            className="pl-10"
          />
        </div>
        <ErrorFormMessage message={errors.confirmPassword?.message} />
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}

      {/* Bouton d'inscription */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-katsumeme-orange"
      >
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
}
