import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserType} from "../../types/user.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserInfo(): Observable<DefaultResponseType | UserType> {
    return this.http.get<DefaultResponseType | UserType>(environment.api + 'users');
  }
}
