import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

import {LayoutComponent} from './components/layout/layout.component';
import {AdComponent} from './components/ad/ad.component';

const components = [
  LayoutComponent,
  AdComponent,
];

@NgModule({
  declarations: [
    components,
  ],
  imports: [
    RouterModule,
    SharedModule,
  ],
  exports: [
    components,
  ]
})
export class CoreModule { }
