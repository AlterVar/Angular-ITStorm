import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {HttpClient} from "@angular/common/http";
import {CallbackType} from "../../../types/callback.type";

@Injectable({
  providedIn: 'root'
})
export class CallbackService {

  constructor(private http: HttpClient) {
  }

  sendCallbackRequest(body: CallbackType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);
  }
}
