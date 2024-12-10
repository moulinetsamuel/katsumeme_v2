"use client";

import { useEffect, useState } from "react";
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { CommentSorting } from "@/components/CommentSorting";

// TODO simule les données venant du future store zustand
import memes from "@/data/memes.json";
import { Comment } from "@/type";

interface CommentSectionProps {
  memeId: number;
}

export function CommentSection({ memeId }: CommentSectionProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [comments, setComments] = useState([] as Comment[]);

  useEffect(() => {
    // TODO simule la methode getCommentsByMemeId(memeId,sortBy) du future store zustand
    // TODO qui appel l'api pour recuperer les commentaires du meme avec l'id memeId
    // TODO et les trie suivant le parametre sortBy
    // TODO si le parametre sortBy change le useEffect se declenche
    const sortedComments = memes.find((meme) => meme.id === memeId)?.comments;
    if (sortedComments) {
      setComments(sortedComments);
    }
  }, [sortBy, memeId]);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <CommentForm />
      <CommentSorting setSortBy={setSortBy} sortBy={sortBy} />
      <CommentList comments={comments} />
    </div>
  );
}
