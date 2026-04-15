export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  content: string;
  parentCommentId?: number;
  likeCount: number;
  replyCount: number;
  isDeleted?: boolean;
  isEdited?: boolean;
  createdAt: string;
  editedAt?: string;
  // enriched on FE
  author?: { userName: string; avatarUrl?: string };
}

export interface AddCommentRequest {
  postId: number;
  content: string;
  parentCommentId?: number;
}

export interface EditCommentRequest {
  content: string;
}