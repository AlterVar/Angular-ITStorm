import {Component, Input, OnInit} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentsService} from "../../services/comments.service";
import {CommentType} from "../../../../types/comment.type";
import {formatDate} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth.service";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentType | null = null;
  like: boolean = false;
  dislike: boolean = false;
  commentAction: string = '';
  formattedDate: string = '';

  constructor(private commentsService: CommentsService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.comment) {
      let commentDate = new Date(this.comment.date);
      this.formattedDate = formatDate(commentDate, 'dd.MM.yyyy HH:mm', 'en-EN');
      this.updateAction();
    }
  }

  updateAction() {
    this.commentsService.getActionsForComment(this.comment!.id)
      .subscribe((data: { comment: string, action: string }[]) => {
        const actions = data as { comment: string, action: string }[];
        if (actions.length > 0) {
          this.commentAction = actions[0].action;
          if (this.commentAction) {
            if (this.commentAction === 'like') {
              this.like = true;
              this.dislike = false;
            } else {
              this.dislike = true;
              this.like = false;
            }
          }
        }
      })
  }

  sendAction(action: string, id: string) {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Чтобы оставлять реакции, необходимо авторизоваться')
    } else {
      this.commentsService.applyAction(action, id)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (action !== 'violate' && data.error) {
              this._snackBar.open('Не получилось оставить реакцию, обратитесь в поддержку');
            }
            if (action === 'violate') {
              if (!data.error) {
                this._snackBar.open('Жалоба была успешно отправлена')
              }
            }
            this.updateAction();
          },
          error: err => {
            this._snackBar.open('Жалоба уже была отправлена');
          }
        })
    }
  }

  updateReactions(action: string, id: string) {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Чтобы оставлять реакции, необходимо авторизоваться');
      return;
    }

    if (!this.commentAction || this.commentAction !== action) {
      action === 'like' ? this.addLike() : this.addDislike();
      this.sendAction(action, id);
    }
  }

  addLike() {
    if (this.comment && this.comment.dislikesCount > 0 && this.commentAction === 'dislike') {
      this.comment.dislikesCount--;
    }
    this.comment!.likesCount++;
    this.like = true;
    this.dislike = false;
  }

  addDislike() {
    if (this.comment && this.comment.likesCount > 0 && this.commentAction === 'like') {
      this.comment.likesCount--;
    }
    this.comment!.dislikesCount++;
    this.like = false;
    this.dislike = true;
  }
}
