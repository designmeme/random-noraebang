import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Favorite} from '../../core/models';
import {AuthService} from '../../core/services/auth.service';
import {catchError, finalize, map, switchMap, tap} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';
import {FavoritesApiService} from '../../core/http/favorites-api.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  list$: Observable<Favorite[]>;
  error: any;

  deleteLoading = false;

  constructor(
    public authService: AuthService,
    private favoritesApi: FavoritesApiService,
    private alertController: AlertController,
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
      // finalize(() => console.log('list finalized')),
    );
  }

  delete(item: Favorite) {
    if (this.deleteLoading) {
      return;
    }

    this.alertController.create({
      header: '즐겨찾기 삭제',
      message: '즐겨찾기에서 삭제할까요?',
      buttons: [
        {
          text: '아니오',
          role: 'cancel',
        }, {
          text: '예',
          handler: () => {
            this.deleteLoading = true;
            this.favoritesApi.deleteItem(item.songId).pipe(
              tap(() => this.deleteLoading = false),
              finalize(() => this.deleteLoading = false),
            ).subscribe();
          }
        }
      ]
    }).then(alert => alert.present());

  }
}
