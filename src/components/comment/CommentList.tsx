import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";

import { TriangleAlert, ThumbsUp, ThumbsDown } from "lucide-react";

import { Comment } from "@/src/type";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div>
      {comments.map((comment) => (
        <TooltipProvider key={comment.id}>
          <Card className="mb-4">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="comment.author.avatarUrl"
                      alt={comment.author}
                    />
                    <AvatarFallback>{"comment.author[0]"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{comment.author}</div>
                    <div className="text-sm text-gray-500">
                      {comment.publishedAt}
                    </div>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <TriangleAlert className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Report comment</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p>{comment.content}</p>
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {comment.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {comment.dislikes}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TooltipProvider>
      ))}
    </div>
  );
}
