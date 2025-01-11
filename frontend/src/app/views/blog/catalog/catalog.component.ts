import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoriesService} from "../../../shared/services/categories.service";
import {CategoryType} from "../../../../types/category.type";
import {debounceTime} from "rxjs";

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
  filterOpen: boolean = false;

  constructor(private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.categoriesService.getCategories()
      .subscribe(data => {
        this.categories = data;
      })

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(500)
      )
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        if (!this.activeParams.page) {
          this.activeParams.page = 1;
        }
        this.appliedFilters = [];
        this.activeParams.categories?.forEach(url => {
          const foundCategory = this.categories.find(item => item.url === url);
          if (foundCategory) {
            this.appliedFilters.push({
              name: foundCategory.name,
              url: url,
            })
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
  }

  toggleFilterSelect() {
    this.filterOpen = !this.filterOpen;
  }

  updateFilter(url: string) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams) {
        this.activeParams.categories = this.activeParams.categories?.filter(item => item !== url);
      } else if (!existingTypeInParams) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
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
