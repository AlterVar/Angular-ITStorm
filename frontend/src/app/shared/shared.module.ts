import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {ArticleComponent} from "./components/article/article.component";
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
  declarations: [
    ArticleComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
  ],
    exports: [
        ArticleComponent,
        CommentComponent
    ]
})
export class SharedModule {
}
