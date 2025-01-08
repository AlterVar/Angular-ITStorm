import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {HttpClient} from "@angular/common/http";
import {ArticlesResponseType} from "../../../types/articles-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  getPopularArticles(): Observable<DefaultResponseType | ArticleType[]> {
    return this.http.get<DefaultResponseType | ArticleType[]>(environment.api + 'articles/top');
  }

  getArticlesWithFilters(params: any): Observable<ArticlesResponseType> {
    return this.http.get<ArticlesResponseType>(environment.api + 'articles', {
      params: params,
    });
  }
}
