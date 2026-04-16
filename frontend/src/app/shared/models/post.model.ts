export interface Post {
  postId: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  visibility: string;
  hashtags?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isDeleted?: boolean;
  originalPostId?: number;
  createdAt: string;
  updatedAt?: string;
  // enriched on FE
  author?: { userName: string; fullName: string; avatarUrl?: string };
  isLiked?: boolean;
}

export interface CreatePostRequest {
  content: string;
  visibility?: string;
  hashtags?: string;
  mediaUrl?: string;
}

export interface UpdatePostRequest {
  content: string;
  visibility?: string;
  hashtags?: string;
}

export interface FeedPost extends Post {}

export interface FeedResponse {
  posts: FeedPost[];
  page: number;
  pageSize: number;
  total: number;
}