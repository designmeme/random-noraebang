import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule),
        data: {
          meta: {
            title: '즐겨찾기',
          }
        }
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule),
        data: {
          meta: {
            title: '내 정보',
          }
        }
      },
      {
        path: '**',
        redirectTo: '/tabs/home'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tabs/home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
