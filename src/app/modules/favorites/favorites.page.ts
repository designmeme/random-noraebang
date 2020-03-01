import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Favorite} from '../../core/models';
import {AuthService} from '../../core/services/auth.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  list$: Observable<Favorite[]>;

  constructor(
    public authService: AuthService,
    private db: AngularFireDatabase,
  ) { }

  ngOnInit() {
    this.list$ = this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.db.list(`favorites/${user.uid}`).snapshotChanges().pipe(
            map(snapshots => {
              return snapshots.map(event => {
                return {
                  ...event.payload.val(),
                  id: event.key,
                };
              });
            }),
          );
        }

        return of([]);
      }),
    );
  }

  delete(item: Favorite) {
    alert('delete');
  }
}
