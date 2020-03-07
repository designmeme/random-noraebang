import {Component, HostBinding, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Favorite, Song} from '../../core/models';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {ApiService} from '../../core/http/api.service';
import {isPlatformServer} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';
import {finalize, switchMap, take, tap} from 'rxjs/operators';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {LoadingService} from '../../core/services/loading.service';

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
  addLoading = false;

  constructor(
    private db: AngularFireDatabase,
    private analytics: AngularFireAnalytics,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: string,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private loadingService: LoadingService,
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
    if (this.addLoading) {
      return false;
    }

    this.addLoading = true;
    this.loadingService.presentLoading();

    this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          this.setSingingMode(true); // todo

          const songRef = this.db.object<Favorite>(`favorites/${user.uid}/${song.id}`);
          return songRef.valueChanges().pipe(
            take(1),
            switchMap(favorite => {
              console.log('song', favorite);
              if (favorite) {
                const count = (favorite.count || 0) + 1;
                return songRef.update({
                  count,
                  updateDate: new Date().toISOString(),
                }).then(() => {
                  this.loadingService.dismissLoading();
                  return this.alertController.create({
                    header: '즐겨찾기 완료',
                    message: `❤️ ${count}번 즐겨찾기했어요!`,
                    buttons: [{ text: '확인' }],
                  }).then(alert => alert.present());
                });
              } else {
                return songRef.set({
                  songId: song.id,
                  count: 1,
                  createDate: new Date().toISOString(),
                }).then(() => {
                  this.loadingService.dismissLoading();
                  return this.alertController.create({
                    header: '즐겨찾기 완료',
                    message: `❤️ 즐겨찾기에 보관했어요`,
                    buttons: [{ text: '확인' }],
                  }).then(alert => alert.present());
                });
              }
            }),
          );
        }

        this.loadingService.dismissLoading();
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
      tap(() => {
        this.addLoading = false;
      }),
      finalize(() => {
        this.addLoading = false;
        this.loadingService.dismissLoading();
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
