import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "@/components/SidebarContent";

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white p-4 fixed left-0 top-16 bottom-0 border-r overflow-y-auto">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 md:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetTitle hidden>Filters</SheetTitle>
          <SheetDescription hidden>Filter memes by category</SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
