import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MemeCard } from "@/components/MemeCard";

// Mock data for dev memes
const memes = [
  {
    id: 1,
    imageUrl: "https://urlme.me/success/typed_a_url/made_a_meme.jpg?source=www",
    title: "When the code finally works",
    likes: 100,
    comments: 25,
  },
  {
    id: 2,
    imageUrl: "https://urlme.me/success/typed_a_url/made_a_meme.jpg?source=www",
    title: "CSS expectations vs reality",
    likes: 150,
    comments: 30,
  },
  {
    id: 3,
    imageUrl: "https://urlme.me/success/typed_a_url/made_a_meme.jpg?source=www",
    title: "Debugging at 3 AM",
    likes: 80,
    comments: 15,
  },
  {
    id: 4,
    imageUrl: "https://urlme.me/success/typed_a_url/made_a_meme.jpg?source=www",
    title: "Group project struggles",
    likes: 120,
    comments: 20,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-32 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} {...meme} />
          ))}
        </div>
      </main>
    </div>
  );
}
