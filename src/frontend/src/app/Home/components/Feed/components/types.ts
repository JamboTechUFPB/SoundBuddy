interface IUser {
  name: string;
  profileImage: string;
}

export type MediaType = 'image' | 'video' | 'audio';

export type Media = {
  type: MediaType;
  url: string;
  name: string;
}

export interface IComment {
  user: IUser; // ObjectId será representado como string no frontend
  content: string;
  createdAt: Date;
}

export interface IPost {
  id?: string; // ObjectId será representado como string no frontend
  user: IUser;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  media: Media | null;
  likes?: number;
  comments?: IComment[];
  tags?: string[];
}

export interface PostData {
  content: string;
  mediaType: 'image' | 'video' | 'audio' | null;
  mediaUrl: string | null;
  mediaName: string | null;
}