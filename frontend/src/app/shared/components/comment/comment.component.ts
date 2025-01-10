import {Component, Input, OnInit} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentsService} from "../../services/comments.service";
import {CommentType} from "../../../../types/comment.type";
import {formatDate} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentType | null = null;

  constructor(private commentsService: CommentsService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.comment) {
        let formattedDate = new Date(this.comment.date);
        this.comment.date = formatDate(formattedDate, 'mm.dd.yyyy, HH:mm','en-US');
    }
  }

  addAction(action: string, id: string) {
    this.commentsService.applyAction(action, id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          this._snackBar.open('Не получилось оставить реакцию, обратитесь в поддержку')
        }
      })
  }
}
