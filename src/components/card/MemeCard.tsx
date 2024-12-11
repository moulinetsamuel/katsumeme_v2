import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import { MemeCardHeader } from "@/src/components/card/MemeCardHeader";
import { MemeCardFooter } from "@/src/components/card/MemeCardFooter";

import { Meme } from "@/src/type";

interface MemeCardProps {
  meme: Meme;
}
export function MemeCard({ meme }: MemeCardProps) {
  return (
    <Card className="overflow-hidden group">
      <MemeCardHeader detail={false} meme={meme} />
      <CardContent className="p-0 relative">
        <Link href={`/meme/${meme.id}`}>
          <Image
            src={meme.imageUrl}
            alt={meme.title}
            width={500}
            height={500}
            className="w-full h-auto hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </CardContent>
      <MemeCardFooter meme={meme} detail={false} />
    </Card>
  );
}
