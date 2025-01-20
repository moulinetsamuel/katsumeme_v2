"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ErrorFormMessage } from "@/src/components/ErrorFormMessage";
import { LoginFormData, loginSchema } from "@/src/utils/schemas/authSchemas";

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function LoginForm({
  onLogin,
  isLoading,
  errorMessage,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
      {/* Champ Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="exemple@email.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Champ Mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="password" className="font-medium">
          Mot de passe
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Mot de passe"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <ErrorFormMessage message={errors.password?.message} />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-katsumeme-orange"
      >
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
}
