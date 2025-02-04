"use client";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search, Plus, Share } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { AuthModal } from "@/src/components/auth/AuthModal";
import { useState } from "react";
import ShareMemeModal from "../meme/ShareMemeModal";

export function SidebarContent() {
  const [isAuthModal, setisAuthModal] = useState(false);
  const [isShareMemeModal, setisShareMemeModal] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleModalOpen = () => {
    if (!isLoggedIn) {
      setisAuthModal(true);
    } else {
      setisShareMemeModal(true);
    }
  };
  return (
    <>
      <div className="space-y-4 pt-4">
        <Button className="w-full bg-katsumeme-orange hover:bg-katsumeme-orange/90">
          <Plus className="mr-2 h-4 w-4" /> Create Meme
        </Button>
        <Button
          variant="outline"
          className="w-full transition-all hover:bg-katsumeme-orange hover:text-white"
          onClick={handleModalOpen}
        >
          <Share className="mr-2 h-4 w-4" />
          Partager un mème
        </Button>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search memes..." className="pl-8" />
        </div>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Latest
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Top Rated
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Bad Rated
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Aléatoire
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Most Comment
          </Button>
        </div>
      </div>
      <AuthModal isOpen={isAuthModal} onClose={() => setisAuthModal(false)} />
      <ShareMemeModal
        isOpen={isShareMemeModal}
        onClose={() => setisShareMemeModal(false)}
      />
    </>
  );
}
