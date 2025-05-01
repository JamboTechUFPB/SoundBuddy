// Primeiro, defina as interfaces para os tipos de dados
export interface Post {
  id: number;
  author: string;
  content: string;
  date: string;
  media: boolean;
}

export interface Event {
  name: string;
  date: string;
  local: string;
}

export interface Hire {
  profileImage: string;
}

export interface SavedItem {
  title: string;
  content: string;
}

export interface ProfileData {
  username: string;
  image: string;
  bio: string;
  followers: number;
  following: number;
  posts: Post[];
  events: Event[];
  hires: Hire[];
  savedItems: SavedItem[];
}