export interface Follow {
  followId: number;
  followerId: number;
  followeeId: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface FollowRequest {
  followeeId: number;
  isPrivate?: boolean;
}