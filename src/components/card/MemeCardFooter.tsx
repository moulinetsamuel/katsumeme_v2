import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Download,
  MessageCircle,
  Star,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { Meme } from "@/src/type";

interface MemeCardFooterProps {
  meme: Meme;
  detail: boolean;
}

export function MemeCardFooter({ meme, detail }: MemeCardFooterProps) {
  const { id, likes, dislikes, comments, tags, isFavorite } = meme;
  const totalVotes = likes + dislikes;
  const ratio = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 0;

  return (
    <TooltipProvider>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              {totalVotes} votes ({ratio}% positive)
            </div>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            {detail ? (
              <></>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/meme/${id}`}>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {comments.length}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View comments</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download meme</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isFavorite ? (
                    <Star className="h-4 w-4 text-katsumeme-yellow" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFavorite ? (
                  <p>Remove from favorites</p>
                ) : (
                  <p>Add to favorites</p>
                )}
              </TooltipContent>
            </Tooltip>
            {detail ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <TriangleAlert className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Report meme</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
        </div>
        {detail ? (
          <></>
        ) : (
          <Link href={`/meme/${id}`} className="mt-2 w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>
    </TooltipProvider>
  );
}
