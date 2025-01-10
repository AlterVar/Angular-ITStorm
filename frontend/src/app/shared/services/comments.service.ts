import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {HttpClient} from "@angular/common/http";
import {ArticlesResponseType} from "../../../types/articles-response.type";
import {CommentType} from "../../../types/comment.type";
import {Params} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  getComments(params: Params): Observable<DefaultResponseType | {allCount: number, comments: CommentType[]}> {
    return this.http.get<DefaultResponseType | {allCount: number, comments: CommentType[]}>(environment.api + 'comments', {
      params: params
    });
  }

  applyAction(action: string, commentId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    })
  }

  getActionsForComment(commentId: string): Observable<{ comment: string, action: string }[]> {
    return this.http.get<{ comment: string, action: string }[]>(environment.api + 'comments/' + commentId + '/actions');
  }
}
