import {Component, HostBinding, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Song} from '../../core/models';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {ApiService} from '../../core/http/api.service';
import {isPlatformServer} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';
import {finalize, switchMap, take} from 'rxjs/operators';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {of} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  song: Song;
  loading = false;
  clickCount = 0;

  @HostBinding('class.mode-singing')
  isSingingMode = false;

  constructor(
    private db: AngularFireDatabase,
    private analytics: AngularFireAnalytics,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: string,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.getRandomSong();
  }

  private getRandomSong() {
    if (this.loading) {
      return;
    }

    this.setSingingMode(false);
    this.loading = true;

    this.apiService.getRandomSong().pipe(
    ).subscribe(song => {
      this.song = song;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  onClickGetRandomSong() {
    this.getRandomSong();

    this.analytics.logEvent('click_get_random_song_button', {
      click_count: ++this.clickCount,
    });
  }

  addToFavorites(song: Song) {
    this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          console.log(user);
          this.setSingingMode(true); // todo

          return of(null);
        }

        return this.alertController.create({
          header: '즐겨찾기',
          message: '즐겨찾기에 담으려면 로그인이 필요해요',
          buttons: [
            {
              text: '괜찮아요',
              role: 'cancel',
            }, {
              text: '로그인하기',
              handler: () => {
                // todo
                // 로그인 후 홈화면 다시 왔을때 노래 그대로 있어야 함
                // or 로그인 후 즐겨찾기에 추가 -> 즐겨찾기 화면으로 리다이렉트
                this.router.navigate(['/tabs/settings']);
              }
            }
          ]
        }).then(alert => alert.present());
      }),
    ).subscribe();

    this.analytics.logEvent('add_to_favorites', {
      song_id: song.id,
      song_title: song.title,
      song_singer: song.singer,
      song_tjNumber: song.tjNumber,
    });
  }

  setSingingMode(on: boolean) {
    if (on && !this.isSingingMode) {
      this.isSingingMode = true;
    } else if (!on && this.isSingingMode) {
      this.isSingingMode = false;
    }
  }

}
