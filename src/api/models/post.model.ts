export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type NewPost = Omit<Post, 'id'>;
