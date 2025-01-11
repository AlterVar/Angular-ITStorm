import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {ArticleComponent} from "./components/article/article.component";
import { CommentComponent } from './components/comment/comment.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ArticleComponent,
    CommentComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
  ],
    exports: [
        ArticleComponent,
        CommentComponent,
        LoaderComponent
    ]
})
export class SharedModule {
}
