export type Category = {
  slug: string;
  name: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  author: string;
  date: string; // ISO date
  badge?: string; // corner marker, e.g. "VÍDEO"
  imageUrl?: string; // omitted -> gray "FOTO" placeholder
  featured?: boolean;
  tags: string[];
  body: string[]; // parágrafos do corpo da matéria
};

export type Comment = {
  id: string;
  author: string;
  date: string; // ISO date
  body: string;
};
