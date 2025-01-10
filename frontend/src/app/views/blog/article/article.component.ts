import { Component, OnInit } from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {CommentType} from "../../../../types/comment.type";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "../../../core/auth.service";
import {CommentsService} from "../../../shared/services/comments.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  serverStaticPath = environment.serverStaticPath;
  article: ArticleType | null = null;
  relatedArticles: ArticleType[] = [];
  comments: CommentType[] = [];
  isLogged: boolean = false;
  numberOfComments: number = 3;

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentsService: CommentsService,
              protected sanitizer: DomSanitizer,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    //TODO: разгрузить, слишком долгая загрузка
    this.isLogged = this.authService.getIsLoggedIn();
    this.activatedRoute.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe((data:ArticleType) => {
            this.article = data;
            if (data.comments && data.text) {
              this.sanitizer.bypassSecurityTrustHtml(data.text);
            }

            this.commentsService.getComments({offset: this.numberOfComments, article: this.article?.id})
              .subscribe((data: DefaultResponseType | {allCount: number, comments: CommentType[]}) => {
                if (data as DefaultResponseType && (data as DefaultResponseType).error) {
                  console.log((data as DefaultResponseType).message);
                }
                const comments = data as {allCount: number, comments: CommentType[]};
                if (comments) {
                  this.comments = comments.comments
                }
              })
          });

        this.articlesService.getRelatedArticles(params['url'])
          .subscribe((data: ArticleType[]) => {
            this.relatedArticles = data;
          })
      })
  }
}
