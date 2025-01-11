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
  showAll: boolean = true;
  offset: number = 0;
  commentsCount: number = 0;
  newCommentText: string = '';

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentsService: CommentsService,
              protected sanitizer: DomSanitizer,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.activatedRoute.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe((data:ArticleType) => {
            this.article = data;
            if (data.comments && data.commentsCount) {
              this.commentsCount = data.commentsCount;
              this.offset = (this.commentsCount - 3) > 0 ? (this.commentsCount - 3) : 0;
            }

            if (data.comments && data.text) {
              this.sanitizer.bypassSecurityTrustHtml(data.text);
              this.getComments();
            }
          });

        this.articlesService.getRelatedArticles(params['url'])
          .subscribe((data: ArticleType[]) => {
            this.relatedArticles = data;
          })
      })
  }

  getComments() {
    this.commentsService.getComments({offset: this.offset, article: this.article?.id})
      .subscribe((data: DefaultResponseType | {allCount: number, comments: CommentType[]}) => {
        if (data as DefaultResponseType && (data as DefaultResponseType).error) {
          console.log((data as DefaultResponseType).message);
        }
        const comments = data as {allCount: number, comments: CommentType[]};
        if (comments) {
          this.comments = comments.comments;
          this.commentsCount = comments.allCount;
          this.offset = this.commentsCount - 3;
        }
      })
  }

  sendComment() {
    if (this.newCommentText) {
      this.commentsService.sendComment(this.newCommentText, this.article!.id)
        .subscribe((data: DefaultResponseType) => {
          this.newCommentText = '';
          this.commentsCount++;
          this.offset = (this.commentsCount - 3) > 0 ? (this.commentsCount - 3) : 0;
          this.getComments();
          this._snackBar.open(data.message);
        })
    }
  }

  showComments() {
    this.showAll = !this.showAll;
    if (!this.showAll) {
      this.offset = 0;
    }
    this.getComments();
  }
}
