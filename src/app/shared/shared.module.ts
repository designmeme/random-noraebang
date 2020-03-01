import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdComponent} from './components/ad/ad.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    AdComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    AdComponent,
  ]
})
export class SharedModule { }
