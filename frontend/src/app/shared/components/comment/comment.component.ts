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
  countLikes: number = 0;
  countDislikes: number = 0;

  constructor(private commentsService: CommentsService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.comment) {
      let formattedDate = new Date(this.comment.date);
      this.comment.date = formatDate(formattedDate, 'mm.dd.yyyy, HH:mm','en-US');

      this.countLikes = this.comment.likesCount;
      this.countDislikes = this.comment.dislikesCount;
    }
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
          },
          error: err => {
            this._snackBar.open('Жалоба уже была отправлена');
          }
        })
    }
  }

  updateReactions(action: string, id: string) {
    if (this.comment) {
      this.commentsService.getActionsForComment(this.comment?.id)
        .subscribe(data => {
          if (data.length === 0 || (data.length > 0 && data[0].action !== action)) {
            action === 'like' ? this.addLike() : this.addDislike();
            this.sendAction(action, id);
          }
        })
    }
  }

  addLike() {
    if (this.countDislikes > 0) {
      this.countDislikes--;
    }
    this.countLikes++;
  }

  addDislike() {
    if (this.countLikes > 0) {
      this.countLikes--;
    }
    this.countDislikes++;
  }
}
