import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoriesService} from "../../../shared/services/categories.service";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'app-blog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  articles: ArticleType[] = [];
  pages: number[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {};
  appliedFilters: AppliedFilterType[] = [];

  constructor(private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.categoriesService.getCategories()
      .subscribe(data => {
        this.categories = data;

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(300)
          )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            this.appliedFilters = [];
            this.activeParams.categories?.forEach(url => {
              for (let i = 0; i < this.categories.length; i++) {
                const foundCategory = this.categories.find(item => item.url === url);
                if (foundCategory) {
                  this.appliedFilters.push({
                    name: foundCategory.name,
                    urlParam: url,
                  })
                }
              }
            })

            this.articleService.getArticlesWithFilters(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                this.articles = data.items;
              })
          })
      })
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }
}
