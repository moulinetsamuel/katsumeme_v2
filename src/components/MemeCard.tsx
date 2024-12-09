import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface MemeCardProps {
  imageUrl: string;
  title: string;
  likes: number;
  comments: number;
}

export function MemeCard({ imageUrl, title, likes, comments }: MemeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4 mr-2" />
            {likes}
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-4 w-4 mr-2" />
            {comments}
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
