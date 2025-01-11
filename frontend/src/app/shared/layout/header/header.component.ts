import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth.service";
import {UserService} from "../../user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserType} from "../../../../types/user.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserType | null = null;
  logoutMenuOpen: boolean = false;
  isBlog: boolean = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.isLogged ? this.getUserInfo() : null;
  }

  ngOnInit(): void {
    this.isBlog = this.router.url.includes('/blog');
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isBlog = this.router.url.includes('/blog');
        }
      })
    this.authService.isLogged$
      .subscribe((value: boolean) => {
        this.isLogged = value;

        if (this.isLogged) {
          this.getUserInfo();
        }
      })
  }

  getUserInfo() {
    this.userService.getUserInfo()
      .subscribe((data: DefaultResponseType | UserType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          console.log((data as DefaultResponseType).message);
        }

        let userResponse = data as UserType;
        if (userResponse.name && userResponse.email && userResponse.id) {
          this.userInfo = userResponse;
        }
      })
    this.logoutMenuOpen = false;
  }

  openMenu() {
    this.logoutMenuOpen = !this.logoutMenuOpen;
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.authService.removeTokens();
          this._snackBar.open('Вы успешно вышли из аккаунта');
          this.router.navigate(['/']);
        },
        error: err => {
          this.authService.removeTokens();
          this._snackBar.open('Вы успешно вышли из аккаунта');
          this.router.navigate(['/']);
        }
      })

    this.logoutMenuOpen = !this.logoutMenuOpen;
  }
}
