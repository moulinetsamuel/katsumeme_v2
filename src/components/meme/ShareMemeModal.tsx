"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { ImagePlus, Plus, Upload, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import Image from "next/image";
import { ErrorFormMessage } from "../ErrorFormMessage";
import { cn } from "@/src/lib/utils";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const uploadFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  image: z.union([
    z
      .instanceof(File, { message: "Une image est requise" })
      .refine((file) => file.size <= MAX_FILE_SIZE, "Fichier trop volumineux")
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "Type de fichier invalide"
      ),
    z.null().refine(() => false, "Une image est requise"),
  ]),

  // tags: z
  //   .array(z.string())
  //   .min(1, "Au moins un tag est requis")
  //   .max(5, "Maximum 5 tags"),
});

type UploadFormSchema = z.infer<typeof uploadFormSchema>;

// Simulation d'une liste de tags existants (à remplacer par les données de la BDD)
const existingTags = [
  "meme",
  "funny",
  "gaming",
  "anime",
  "politics",
  "sports",
  "cats",
  "dogs",
  "music",
  "movies",
  "tech",
  "food",
];
interface ShareMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareMemeModal({
  isOpen,
  onClose,
}: ShareMemeModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
  });

  // pour réinitialiser le formulaire et les tags lors de la fermeture du modal
  useEffect(() => {
    if (!isOpen) {
      reset();
      setTags([]);
      setImagePreview(null);
    }
  }, [isOpen, reset]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("image", file, { shouldValidate: true });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          console.log("Image uploadée:", file.name);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10485760, // 10MB
    multiple: false,
  });

  const filteredTags = existingTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
  );

  const handleAddTag = (tag: string) => {
    if (tags.length >= 5) return;
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag.toLowerCase()]);
      console.log("Tag ajouté:", tag);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    console.log("Tag supprimé:", tagToRemove);
  };

  const onSubmit = (data: UploadFormSchema) => {
    console.log("Formulaire soumis avec:", {
      title: data.title,
      image: data.image,
      tags: tags,
    });
    reset();
    setTags([]);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Partager un mème
            </DialogTitle>
            <DialogDescription>
              Partagez votre mème avec la communauté. Soyez créatif !
            </DialogDescription>
          </DialogHeader>

          {/* Champ Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Titre
            </Label>
            <div className="relative">
              <Input
                id="title"
                type="text"
                placeholder="Titre du mème"
                className="pr-10"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
            </div>
            <ErrorFormMessage message={errors.title?.message} />
          </div>

          {/* Champ Image */}
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Image
              </Label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", null, { shouldValidate: true });
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "relative rounded-lg border-2 border-dashed transition-colors",
                      isDragActive
                        ? "border-katsumeme-orange bg-katsumeme-orange/10"
                        : "border-gray-300 hover:border-katsumeme-orange hover:bg-katsumeme-orange/5",
                      "cursor-pointer"
                    )}
                  >
                    <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-4">
                      {isDragActive ? (
                        <>
                          <Upload className="h-8 w-8 text-katsumeme-orange animate-bounce" />
                          <div className="text-sm text-katsumeme-orange font-medium">
                            Déposez votre image ici
                          </div>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-500">
                            <span className="font-semibold text-katsumeme-orange">
                              Cliquez pour uploader
                            </span>{" "}
                            ou glissez-déposez
                          </div>
                          <div className="text-xs text-gray-400">
                            PNG, JPG, GIF jusqu&apos;à 10MB
                          </div>
                        </>
                      )}
                    </div>
                    <Input {...register("image")} {...getInputProps()} />
                  </div>
                )}
              </div>
              <ErrorFormMessage message={errors.image?.message} />
            </div>
          </div>

          {/* Champ Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tags <span className="text-xs text-gray-400">(max 5)</span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            {tags.length < 5 && (
              <Popover
                open={showTagSuggestions}
                onOpenChange={setShowTagSuggestions}
              >
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      placeholder="Ajouter des tags"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagSuggestions(true);
                      }}
                      className="pr-10"
                    />
                    <Plus className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100%-24px)] p-1"
                  align="start"
                >
                  <div className="max-h-[200px] overflow-auto">
                    {filteredTags.length > 0 ? (
                      <div className="grid gap-1">
                        {filteredTags.map((tag) => (
                          <Button
                            key={tag}
                            variant="ghost"
                            className="justify-start font-normal"
                            onClick={() => handleAddTag(tag)}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      tagInput && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-normal"
                          onClick={() => handleAddTag(tagInput)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Créer &quot;{tagInput}&quot;
                        </Button>
                      )
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-katsumeme-orange hover:bg-katsumeme-orange/90 text-white transition-colors"
            >
              Publier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
