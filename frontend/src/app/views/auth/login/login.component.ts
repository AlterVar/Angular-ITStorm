import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  })
  subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.subscription.add(
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            let loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken
              || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            //TODO: подключить snackBar
            if (error) {
              this._snackBar.open(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken, loginResponse.userId);
            this._snackBar.open('Вы успешно вошли в аккаунт');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        })
      )
    }
  }
}
