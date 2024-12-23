import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Mail } from "lucide-react";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { email, pseudo } = searchParams;

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
          <CardDescription className="text-base">
            Bienvenue {pseudo} !
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Nous avons envoyé un email de vérification à{" "}
            <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Si vous ne trouvez pas l&apos;email, veuillez vérifier votre dossier
            spam. Le lien de vérification expirera dans 1 heures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
