import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MetaGuard} from '@ngx-meta/core';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
