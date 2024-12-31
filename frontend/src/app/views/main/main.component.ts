import { Component, OnInit } from '@angular/core';
import {OwlOptions, SlideModel, SlidesOutputData} from "ngx-owl-carousel-o";
import {ArticlesService} from "../../services/articles.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticleType} from "../../../types/article.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  popularArticles: ArticleType[] = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  activeSlide: SlideModel = {id: 'slide-1'};

  constructor(private articleService: ArticlesService,
              private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe({
        next: (data: DefaultResponseType | ArticleType[]) => {
          if ((data as DefaultResponseType).error !== undefined) {
            console.log((data as DefaultResponseType).message);
          }
          if (data as ArticleType[]) {
            this.popularArticles = data as ArticleType[];
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            console.log(errorResponse.error.message);
          }
        }
      })
  }

  makeActive(data: SlidesOutputData) {
   this.activeSlide = (data.slides && data.slides.length > 0) ? data.slides[0] : {id: 'slide-1'};
  }
}
