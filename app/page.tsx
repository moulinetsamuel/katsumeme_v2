import { Header } from "@/src/components/Header";
import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { MemeCard } from "@/src/components/card/MemeCard";

// TODO simule les données venant du future store zustand
//TODO simule la methode getMemes du future store zustand
import memes from "@/src/data/memes.json";
import { notFound } from "next/navigation";

export default function Home() {
  //TODO si il n'y a pas de données on doit utiliser la methode fetchMemes du future store zustand
  // TODO le if dans un useEffect si il n'y a pas de memes dans le store
  if (!memes) {
    //TODO Ici on doit utiliser la methode fetchMemes du future store zustand
    //TODO qui appel l'api pour recuperer les memes
    //TODO si les memes n'existent pas on doit rediriger l'utilisateur vers la page 404
    //TODO en utilisant la fonction notFound() dans le catch de la requete
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-32 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      </main>
    </div>
  );
}
