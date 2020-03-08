import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Favorite} from '../../core/models';
import {AuthService} from '../../core/services/auth.service';
import {catchError, finalize, map, switchMap, tap} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';
import {FavoritesApiService} from '../../core/http/favorites-api.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  list$: Observable<Favorite[]>;
  error: any;

  constructor(
    public authService: AuthService,
    private favoritesApi: FavoritesApiService,
  ) { }

  ngOnInit() {
    this.list$ = this.favoritesApi.getList().pipe(
      tap(() => {
        this.error = null;
      }),
      catchError(error => {
        this.error = error;
        return of([]);
      }),
      finalize(() => console.log('list finalized')),
    );
  }

  delete(item: Favorite) {
    alert('delete');
  }
}
