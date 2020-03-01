import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {environment} from '../environments/environment';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {
  AngularFireAnalyticsModule,
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {DOCUMENT} from '@angular/common';
import {version} from '../../package.json';
import {MetaLoader, MetaModule, MetaStaticLoader, PageTitlePositioning} from '@ngx-meta/core';

export function metaFactory(document: Document): MetaLoader {
  const origin = environment.url;
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: '랜덤 노래방',
    applicationUrl: origin,
    defaults: {
      title: '랜덤노래방 - 랜덤게임・애창곡',
      // tslint:disable-next-line:max-line-length
      description: '노래방에서 어떤 노래를 부를지 고민이 된다면, 이제 랜덤 노래방과 함께 신나게 노래해요. 전체곡, 신곡, 인기곡, 내 노래 목록에서 무작위로 노래를 선정해줘요. 선정한 노래는 TJ미디어와 금영노래방 번호를 한번에 알 수 있어요.',
      author: '이지혜, ghe.lee19@gmail.com',
      robots: 'index, follow',
      // og tags https://developers.facebook.com/docs/sharing/webmasters
      'og:site_name': '랜덤 노래방',
      'og:image': `${origin}/assets/images/og/home.png`, // full url
      'og:type': 'website',
      'og:locale': 'ko_KR',
      'og:email': 'ghe.lee19@gmail.com',
    },
    callback: (value) => {
      // production 모드가 아니면 '[Dev]' 문구를 타이틀 프리픽스로 추가함.
      if (!environment.production) {
        return of(value).pipe(
          tap(() => {
            if (document && !/^\[Dev\]/.test(document.title)) {
              document.title = '[Dev]' + document.title;
            }
          }),
        );
      }
      return value;
    }
  });
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory),
      deps: [DOCUMENT],
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // AngularFireAnalytics providers
    ScreenTrackingService, // route 에 따라 자동으로 screen_view events 를 발생시킴
    UserTrackingService, // 로그인 상태에 따라 자동으로 setuserid 함수를 호출함
    { provide: DEBUG_MODE, useValue: !environment.production }, // true: DebugView 를 활성화
    { provide: APP_NAME, useValue: 'random-noraebang' }, // APP_NAME + APP_VERSION:  Analytics > Latest Release 를 활성화
    { provide: APP_VERSION, useValue: version },
    // --AngularFireAnalytics providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
