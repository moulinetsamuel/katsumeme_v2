import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function TokenErrorPage() {
  const router = useRouter();

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Oups, il n&apos;y a plus rien ici
        </h1>
        <p className="text-sm text-muted-foreground">
          Cette page n&apos;est plus accessible. Si vous avez perdu votre email
          d&apos;activation, vous pouvez demander à en recevoir un nouveau
          depuis la page de connexion.
        </p>
        <Button onClick={() => router.push("/")}>
          Retour à la page d&apos;accueil
        </Button>
      </div>
    </div>
  );
}
