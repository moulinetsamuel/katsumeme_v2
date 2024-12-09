import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Share2 } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 fixed left-0 top-16 bottom-0 border-r overflow-y-auto">
      <div className="space-y-4 pt-8">
        <Button className="w-full bg-katsumeme-orange hover:bg-katsumeme-orange/90">
          <Plus className="mr-2 h-4 w-4" /> Create Meme
        </Button>
        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" /> Share
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
            Katsumeme Du Moment
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Most Comment
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Most Download
          </Button>
        </div>
      </div>
    </div>
  );
}
