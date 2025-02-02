import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {CommentType} from "../../../../types/comment.type";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "../../../core/auth.service";
import {CommentsService} from "../../../shared/services/comments.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  serverStaticPath = environment.serverStaticPath;
  article: ArticleType | null = null;
  relatedArticles: ArticleType[] = [];
  comments: CommentType[] = [];
  isLogged: boolean = false;
  loading: boolean = false;
  shownAll: boolean = false;
  offset: number = 0;
  shownComments: number = 3;
  commentsCount: number = 0;
  newCommentText: string = '';
  subscription = new Subscription();

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentsService: CommentsService,
              protected sanitizer: DomSanitizer,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.subscription.add(
    this.activatedRoute.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe((data:ArticleType) => {
            this.article = data;
            if (data.comments && data.commentsCount) {
              this.commentsCount = data.commentsCount;
              this.shownComments = data.commentsCount < 3 ? data.commentsCount : 3;
              this.offset = (-10 + -(this.commentsCount - 3)) < -10 ? (-10 + -(this.commentsCount - 3)) : 0;
            }

            if (data.comments && data.text) {
              this.sanitizer.bypassSecurityTrustHtml(data.text);
              this.getComments(this.offset);
            }
          });

        this.subscription.add(
        this.articlesService.getRelatedArticles(params['url'])
          .subscribe((data: ArticleType[]) => {
            this.relatedArticles = data;
          })
        )
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getComments(offset: number = this.shownComments) {
    this.subscription.add(
    this.commentsService.getComments({offset: offset, article: this.article?.id})
      .subscribe((data: DefaultResponseType | {allCount: number, comments: CommentType[]}) => {
        if (data as DefaultResponseType && (data as DefaultResponseType).error) {
          console.log((data as DefaultResponseType).message);
        }
        const comments = data as {allCount: number, comments: CommentType[]};
        if (comments && comments.comments.length > 3) {
          this.comments = [...this.comments, ...comments.comments];
        } else {
          this.shownComments = 3;
          this.comments = comments.comments;
        }
        this.commentsCount = comments.allCount;
        this.offset = (-10 + -(this.commentsCount - 3));
        this.loading = false;
      })
    )
  }

  sendComment() {
    if (this.newCommentText) {
      this.subscription.add(
      this.commentsService.sendComment(this.newCommentText, this.article!.id)
        .subscribe((data: DefaultResponseType) => {
          this.newCommentText = '';
          this.commentsCount++;
          this.offset = (-10 + -(this.commentsCount - 3)) < -10 ? (-10 + -(this.commentsCount - 3)) : 0;
          this.getComments(this.offset);
          this._snackBar.open(data.message);
        })
      )
    }
  }

  showTenMoreComments() {
    this.loading = true;
    this.getComments();
    this.shownComments += 10;
    this.shownAll = this.commentsCount <= this.shownComments;
  }

  hideMostComments() {
    this.getComments(this.offset);
    this.shownComments = 3;
    this.shownAll = false;
  }
}
