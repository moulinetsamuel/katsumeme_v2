export interface User {
  id: number;
  email: string;
  pseudo: string;
  avatar_url: string;
  role: "USER" | "ADMIN";
  created_at: string;
}

export interface Meme {
  id: number;
  imageUrl: string;
  title: string;
  author: string;
  publishedAt: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  tags: Tags[];
  isFavorite: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  publishedAt: string;
  likes: number;
  dislikes: number;
}

export interface Tags {
  id: number;
  name: string;
}
