import { Component, OnInit } from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {CommentType} from "../../../../types/comment.type";
import {DomSanitizer} from "@angular/platform-browser";

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

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              protected sanitizer: DomSanitizer,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe((data:ArticleType) => {
            this.article = data;
            if (data.comments && data.text) {
              this.sanitizer.bypassSecurityTrustHtml(data.text);
              this.comments = data.comments;
            }
          });

        this.articlesService.getRelatedArticles(params['url'])
          .subscribe((data: ArticleType[]) => {
            this.relatedArticles = data;
          })
      })
  }
}
