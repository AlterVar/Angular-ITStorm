import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {LoginResponseType} from "../../types/login-response.type";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  setTokens(accessToken: string, refreshToken: string, userId: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userIdKey, userId);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType>  {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: localStorage.getItem(this.refreshTokenKey)
      });
    }
    throw throwError(() => 'Can not use token');
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    })
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    })
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      })
    }
    throw  throwError(() => 'Cannot find token');
  }
}
