import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {combineLatest, of} from 'rxjs';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Favorite, Song} from '../models';

@Injectable({
  providedIn: 'root'
})
export class FavoritesApiService {

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
  ) { }

  getList() {
    return this.authService.user$.pipe(
      filter(user => !!user),
      switchMap(user => this.db.list<Favorite>(`favorites/${user.uid}`, ref => ref.orderByChild('updateDate')).valueChanges()),
      switchMap(list => {
        if (list && list.length > 0) {
          return combineLatest(
            of(list.reverse()), // reverse list
            combineLatest<Song[]>(list.map(item => {
              return this.db.object(`songs/${item.songId}`).valueChanges().pipe(first());
            })),
          ).pipe(
            map(([favorites, songs]) => {
              return favorites.map(f => {
                const songData = songs.find(s => +s.id === +f.songId) || {};
                return {
                  ...f,
                  song: {
                    title: songData.title,
                    singer: songData.singer,
                    tjNumber: songData.tjNumber,
                  }
                };
              });
            }),
          );
        } else {
          return of(null);
        }
      }),
    );
  }

  getItem(songId: string | number) {
    return this.authService.user$.pipe(
      filter(user => !!user),
      switchMap(user => this.db.object<Favorite>(`favorites/${user.uid}/${songId}`).valueChanges()),
      switchMap(favorite => {
        if (favorite) {
          return this.db.object<Song>(`songs/${favorite.songId}`).valueChanges().pipe(
            first(),
            map(song => {
              song = song || {};
              return {
                ...favorite,
                song: {
                  title: song.title,
                  singer: song.singer,
                  tjNumber: song.tjNumber,
                }
              };
            }),
          );
        } else {
          return of(null);
        }
      }),

    );
  }

  createItem(payload: Favorite) {
    return this.authService.user$.pipe(
      first(),
      filter(user => !!user),
      switchMap(user => this.db.object<Favorite>(`favorites/${user.uid}/${payload.songId}`).set(payload)),
    );
  }

  updateItem(payload: Favorite) {
    return this.authService.user$.pipe(
      first(),
      filter(user => !!user),
      switchMap(user => this.db.object<Favorite>(`favorites/${user.uid}/${payload.songId}`).update(payload)),
    );
  }

  deleteItem(songId: string | number) {
    return this.authService.user$.pipe(
      first(),
      filter(user => !!user),
      switchMap(user => this.db.object<Favorite>(`favorites/${user.uid}/${songId}`).remove()),
    );
  }
}
