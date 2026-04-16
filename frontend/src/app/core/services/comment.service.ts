import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Comment, AddCommentRequest, EditCommentRequest } from '../../shared/models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly base = environment.commentApi;
  constructor(private http: HttpClient) {}

  addComment(req: AddCommentRequest) {
    return this.http.post<Comment>(this.base, req);
  }

  getByPost(postId: number) {
    return this.http.get<Comment[]>(`${this.base}/post/${postId}`);
  }

  getTopLevel(postId: number) {
    return this.http.get<Comment[]>(`${this.base}/toplevel/${postId}`);
  }

  getReplies(commentId: number) {
    return this.http.get<Comment[]>(`${this.base}/replies/${commentId}`);
  }

  editComment(id: number, req: EditCommentRequest) {
    return this.http.put<Comment>(`${this.base}/${id}`, req);
  }

  deleteComment(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getCount(postId: number) {
    return this.http.get<{ count: number }>(`${this.base}/count/${postId}`);
  }
}