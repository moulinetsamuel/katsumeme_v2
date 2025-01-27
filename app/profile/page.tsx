"use client";

import { Header } from "@/src/components/Header";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { AlertCircle, Camera, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { useAuthStore } from "@/src/store/useAuthStore";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUpdateAvatar } from "@/src/services/authService";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import {
  passwordSchema,
  pseudoSchema,
} from "@/src/utils/schemas/profilSchemas";

export default function ProfilePage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const [avatar, setAvatar] = useState(user?.avatar_url || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const {
    register: registerPseudo,
    handleSubmit: handleSubmitPseudo,
    formState: { errors: errorsPseudo },
  } = useForm({ resolver: zodResolver(pseudoSchema) });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="container max-w-2xl py-24 text-center">
          <h1 className="text-xl font-bold">Accès restreint</h1>
          <p className="text-muted-foreground mt-4">
            Vous n&apos;êtes pas connecté. Veuillez vous connecter pour accéder
            à vos informations personnelles.
          </p>
        </main>
      </>
    );
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetchUpdateAvatar(token, formData);
      setAvatar(response.avatar_url);
      toast({
        title: "Avatar mis à jour",
        description: response.message,
      });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Erreur lors de la mise à jour de l'avatar"
        );
      } else {
        setErrorMessage("Erreur lors de la mise à jour de l'avatar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container max-w-2xl py-24 space-y-8">
        {/* En-tête du profil */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar} alt={`Avatar de ${user?.pseudo}`} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                variant="secondary"
              >
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Camera className="w-4 h-4" />
                </Label>
              </Button>
              <Input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Paramètres du profil</h1>
              <p className="text-muted-foreground">
                Gérez vos paramètres de compte et vos préférences
              </p>
            </div>
          </div>
          <Separator />
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="text-red-500 text-sm text-center">{errorMessage}</div>
        )}

        {/* Paramètres du compte */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="pseudo">
                <AccordionTrigger>Modifier mon pseudo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-username">Nouveau pseudo</Label>
                      <Input
                        id="new-username"
                        placeholder="Entrez votre nouveau pseudo"
                      />
                    </div>
                    <Button>Enregistrer</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="password">
                <AccordionTrigger>Modifier mon mot de passe</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirmer le mot de passe
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Enregistrer</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Vos statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">
                  Mèmes postés
                </dt>
                <dd className="text-sm font-medium">0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">
                  Commentaires
                </dt>
                <dd className="text-sm font-medium">0</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Zone de danger */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
            <CardDescription>
              Supprimez définitivement votre compte et tout son contenu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Cette action est irréversible. Elle supprimera définitivement
                votre compte et toutes vos données de nos serveurs.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Supprimer mon compte</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Êtes-vous absolument sûr ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Elle supprimera
                    définitivement votre compte et toutes vos données associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Supprimer mon compte
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
