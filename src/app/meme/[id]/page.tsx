"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { MemeCardHeader } from "@/components/MemeCardHeader";
import { MemeCardFooter } from "@/components/MemeCardFooter";
import { CommentSection } from "@/components/CommentSection";
import { Card, CardContent } from "@/components/ui/card";

// TODO simule les données venant du future store zustand
import memes from "@/data/memes.json";

export default function MemePage() {
  const { id } = useParams();
  // TODO simule la methode getMemeById du future store zustand
  const meme = memes.find((meme) => meme.id === Number(id));

  // TODO si il n'y a pas de données on doit utiliser la methode fetchMemeById du future store zustand
  // TODO le if dans un useEffect si il n'y a pas de meme dans le store
  if (!meme) {
    // TODO Ici on doit utiliser la methode fetchMemeById du future store zustand
    // TODO qui appel l'api pour recuperer le meme avec l'id id
    // TODO si le meme n'existe pas on doit rediriger l'utilisateur vers la page 404
    // TODO en utilisant la fonction notFound() dans le catch de la requete
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 p-4">
        <Card className="max-w-3xl mx-auto">
          <MemeCardHeader meme={meme} detail={true} />
          <CardContent className="p-0">
            <Image
              src={meme.imageUrl}
              alt={meme.title}
              width={1000}
              height={1000}
              className="w-full h-auto"
            />
          </CardContent>
          <MemeCardFooter meme={meme} detail={true} />
        </Card>
        <CommentSection memeId={meme.id} />
      </main>
    </div>
  );
}
