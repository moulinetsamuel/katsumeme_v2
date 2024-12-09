import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white border-b fixed top-0 left-0 right-0 z-10">
      <div className=" mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/Logoname.png"
            alt="Katsumeme logo"
            width={180}
            height={180}
          />
        </Link>
        <Button className="bg-katsumeme-purple hover:bg-katsumeme-purple/90 text-white">
          Se connecter
        </Button>
      </div>
    </header>
  );
}
