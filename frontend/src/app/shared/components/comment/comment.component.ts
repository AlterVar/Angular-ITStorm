import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentsService} from "../../services/comments.service";
import {CommentType} from "../../../../types/comment.type";
import {formatDate} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() comment: CommentType | null = null;
  like: number = 0;
  dislike: number = 0;
  commentAction: string = '';
  formattedDate: string = '';
  actions = {like: "like", dislike: "dislike"};
  subscription = new Subscription();

  constructor(private commentsService: CommentsService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.comment) {
      let commentDate = new Date(this.comment.date);
      this.formattedDate = formatDate(commentDate, 'dd.MM.yyyy HH:mm', 'en-EN');
      if (this.authService.getIsLoggedIn()) {
        this.subscription.add(
          this.commentsService.getActionsForComment(this.comment!.id)
            .subscribe({
              next: (data: { comment: string, action: string }[]) => {
                const actions = data as { comment: string, action: string }[];
                if (actions.length > 0) {
                  this.commentAction = actions[0].action;
                  if (this.commentAction) {
                    this.commentAction === this.actions.like ? this.like = 1 : this.dislike = 1;
                  }
                } else {
                  this.like = 0;
                  this.dislike = 0;
                }
              },
              error: (err) => {
                console.log(err);
              }
            })
        )
      }
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  sendAction(action: string, id: string) {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Чтобы оставлять реакции, необходимо авторизоваться')
    } else {
      this.changeReaction(action);
      this.subscription.add(
        this.commentsService.applyAction(action, id)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if (action === 'violate') {
                this._snackBar.open('Жалоба успешно отправлена');
                return;
              }
              this.changeAction();
            },
            error: err => {
              this._snackBar.open('Жалоба уже отправлена');
            }
          })
      )
    }
  }

  changeAction() {
    this.subscription.add(
      this.commentsService.getActionsForComment(this.comment!.id)
        .subscribe((data: { comment: string, action: string }[]) => {
          const actions = data as { comment: string, action: string }[];
          if (actions.length > 0) {
            this.commentAction = actions[0].action;
          }
        })
    )
  }

  changeReaction(action: string) {
    if (action === this.actions.like) {
      if (this.like) {
        this.like = 0;
        this.comment!.likesCount--;
        return;
      }
      if (this.dislike) {
        this.dislike = 0;
        this.comment!.dislikesCount--;
      }
      this.like = 1;
      this.comment!.likesCount++;
      this._snackBar.open('Ваш голос учтен');
    }

    if (action === this.actions.dislike) {
      if (this.dislike) {
        this.dislike = 0;
        this.comment!.dislikesCount--;
        return;
      }
      if (this.like) {
        this.like = 0;
        this.comment!.likesCount--;
      }
      this.dislike = 1;
      this.comment!.dislikesCount++;
      this._snackBar.open('Ваш голос учтен');
    }
  }
}
