import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface CommentSortingProps {
  setSortBy: (value: string) => void;
  sortBy: string;
}

export function CommentSorting({ setSortBy, sortBy }: CommentSortingProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">All Comments</h3>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="mostLiked">Most Liked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
