import {Component, ElementRef, HostBinding, Inject, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import 'firebase/database';
import {ApiService} from '../../../../core/http/api.service';
import {Song} from '../../../../core/models';
import {isPlatformServer} from '@angular/common';
import {AngularFireAnalytics, APP_VERSION} from '@angular/fire/analytics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  song: Song;
  favorites: Song[] = [];
  loading = false;
  clickCount = 0;

  @HostBinding('class.mode-singing')
  isSingingMode = false;

  constructor(
    private db: AngularFireDatabase,
    private analytics: AngularFireAnalytics,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(APP_VERSION) public version: string,
    private render2: Renderer2,
    private elementRef: ElementRef,
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
    this.setSingingMode(true);

    if (this.isMyFavorite(song)) {
      return;
    }

    this.favorites.push(song);

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
      this.render2.setStyle(this.elementRef.nativeElement, 'background-color', this.getRandomRgb());
    } else if (!on && this.isSingingMode) {
      this.isSingingMode = false;
      this.render2.removeAttribute(this.elementRef.nativeElement, 'style');
    }
  }

  isMyFavorite(song: Song): boolean {
    return this.favorites.findIndex(s => s.id === song.id) !== -1;
  }

  getRandomRgb() {
    const num = Math.round(0xffffff * Math.random());
    const r = num >> 16;
    const g = num >> 8 & 255;
    const b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  refresh() {
    location.reload();
  }

}
