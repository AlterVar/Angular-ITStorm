import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions, SlideModel, SlidesOutputData} from "ngx-owl-carousel-o";
import {ArticlesService} from "../../shared/services/articles.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticleType} from "../../../types/article.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  popularArticles: ArticleType[] = [];
  dialogData: string = 'Услуга';
  dialog: HTMLElement | null = null;
  dialogBtn: HTMLElement | null = null;

  customOptionsHero: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 500,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  }

  serviceForm = this.fb.group({
    service: [{value: '', disabled: true}],
    name: ['', Validators.required],
    phone: ['', Validators.required]
  })


  activeSlide: SlideModel = {id: 'slide-1'};

  constructor(private articleService: ArticlesService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.dialog = document.getElementById('services-dialog');
    this.dialogBtn = document.getElementById('dialog-btn');
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

  openDialog(title: string) {
    this.dialogData = title;
    this.serviceForm.get('service')?.setValue(title);
    if (this.dialog) {
      this.dialog.style.display = 'flex';
    }
  }

  closeDialog(event: Event) {
    event.stopPropagation();
    if (this.dialog && (event.target === event.currentTarget || event.currentTarget === this.dialogBtn)) {
      this.dialog.style.display = 'none';
    }
  }
}
