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
import { AlertCircle, Camera, Eye, EyeOff, User } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fetchUpdateAvatar,
  fetchUpdateProfile,
} from "@/src/services/authService";
import React, { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import {
  PasswordData,
  passwordSchema,
  PseudoData,
  pseudoSchema,
} from "@/src/utils/schemas/profilSchemas";
import { ErrorFormMessage } from "@/src/components/ErrorFormMessage";

export default function ProfilePage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const token = localStorage.getItem("authToken");

  const { toast } = useToast();

  const {
    register: registerPseudo,
    handleSubmit: handleSubmitPseudo,
    formState: { errors: errorsPseudo },
    reset: resetPseudo,
  } = useForm<PseudoData>({ resolver: zodResolver(pseudoSchema) });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const handleAccordionChange = (value: string) => {
    if (!value) {
      resetPseudo();
      resetPassword();
    }
    setOpenAccordion(value);
  };

  if (!isLoggedIn || !token) {
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

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const response = await fetchUpdateAvatar(token, formData);
      if (user) {
        setUser({ ...user, avatar_url: response.avatar_url });
      }
      toast({
        title: response.message,
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

  const onSubmitPseudo = async (data: PseudoData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchUpdateProfile(token, data);
      if (user) {
        setUser({ ...user, pseudo: result.pseudo });
      }
      toast({
        title: result.message,
      });
      resetPseudo();
      handleAccordionChange("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Erreur lors de la mise à jour du pseudo"
        );
      } else {
        setErrorMessage("Erreur lors de la mise à jour du pseudo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchUpdateProfile(token, data);
      toast({
        title: result.message,
      });
      resetPassword();
      handleAccordionChange("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Erreur lors de la mise à jour du mot de passe"
        );
      } else {
        setErrorMessage("Erreur lors de la mise à jour du mot de passe");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    console.log("Suppression du compte");
    toast({
      title: "Votre compte a été supprimé",
    });
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
                <AvatarImage
                  src={user?.avatar_url}
                  alt={`Avatar de ${user?.pseudo}`}
                />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                variant="secondary"
                disabled={isLoading}
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
            <Accordion
              type="single"
              collapsible
              value={openAccordion || ""}
              onValueChange={handleAccordionChange}
              className="w-full"
            >
              <AccordionItem value="pseudo">
                <AccordionTrigger>Modifier mon pseudo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <form
                      className="space-y-2"
                      onSubmit={handleSubmitPseudo(onSubmitPseudo)}
                    >
                      <Label htmlFor="pseudo">Nouveau pseudo</Label>
                      <Input id="pseudo" {...registerPseudo("pseudo")} />
                      <ErrorFormMessage
                        message={errorsPseudo.pseudo?.message}
                      />
                      <Button type="submit">Enregistrer</Button>
                    </form>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="password">
                <AccordionTrigger>Modifier mon mot de passe</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <form
                      onSubmit={handleSubmitPassword(onSubmitPassword)}
                      className="space-y-2"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            {...registerPassword("oldPassword")}
                            aria-invalid={!!errorsPassword.oldPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label={
                              showOldPassword
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                            }
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <ErrorFormMessage
                          message={errorsPassword.oldPassword?.message}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...registerPassword("password")}
                            aria-invalid={!!errorsPassword.password}
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
                        <ErrorFormMessage
                          message={errorsPassword.password?.message}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmez le nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...registerPassword("confirmPassword")}
                            aria-invalid={!!errorsPassword.confirmPassword}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label={
                              showConfirmPassword
                                ? "Masquer la confirmation du mot de passe"
                                : "Afficher la confirmation du mot de passe"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <ErrorFormMessage
                          message={errorsPassword.confirmPassword?.message}
                        />
                      </div>
                      <Button type="submit">Enregistrer</Button>
                    </form>
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
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
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
