import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {AuthForwardGuard} from "./core/auth-forward.guard";

const routes: Routes = [
  {path: '', component: LayoutComponent, children: [
      {path: '', component: MainComponent},
      {path: '', loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule), canActivate: [AuthForwardGuard]},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
