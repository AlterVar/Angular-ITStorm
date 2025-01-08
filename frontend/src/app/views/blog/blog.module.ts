import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import {SharedModule} from "../../shared/shared.module";
import {MatExpansionModule} from "@angular/material/expansion";


@NgModule({
  declarations: [
    CatalogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
