import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ResendFormData } from "@/src/utils/schemas/authSchemas";

interface ResendFormProps {
  onResend: (data: ResendFormData) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function ResendForm({
  onResend,
  isLoading,
  errorMessage,
}: ResendFormProps) {
  const { register, handleSubmit } = useForm<ResendFormData>();

  return (
    <form onSubmit={handleSubmit(onResend)} className="space-y-4 mt-4">
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
        />
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}

      {/* Bouton d'envoi */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-katsumeme-orange"
      >
        {isLoading ? "Envoi en cours..." : "Renvoyer l'email"}
      </Button>
    </form>
  );
}
