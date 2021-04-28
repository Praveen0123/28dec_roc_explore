import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeResolverService } from '@app/core/services';

import { PageNotFoundComponent } from './features/common-ui/containers/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/modeling-tool/modeling-tool.module').then(m => m.ModelingToolModule),
    resolve: { userProfile: HomeResolverService }
  },
  {
    path: 'compare-models',
    loadChildren: () => import('./features/compare/compare.module').then(m => m.CompareModule)
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      initialNavigation: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
