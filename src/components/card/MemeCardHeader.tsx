import { CardHeader } from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import Link from "next/link";
import { Meme } from "@/src/type";

interface MemeHeaderProps {
  meme: Meme;
  detail: boolean;
}

export function MemeCardHeader({ meme, detail }: MemeHeaderProps) {
  const { id, title, author, publishedAt } = meme;

  return (
    <CardHeader className="bg-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar>
            {/* TODO remplacer par les donné du store User */}
            <AvatarImage src="meme.author.avatarUrl" alt={author} />
            <AvatarFallback>{"meme.author.charAt(0)"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-sm text-gray-500">{publishedAt}</div>
          </div>
        </div>
        {detail ? (
          <h3 className="font-semibold">{title}</h3>
        ) : (
          <Link href={`/meme/${id}`}>
            <h3 className="font-semibold hover:text-katsumeme-orange transition-colors">
              {title}
            </h3>
          </Link>
        )}
      </div>
    </CardHeader>
  );
}
