import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {iif, Observable, of} from 'rxjs';
import {Favorite} from '../../../../core/models';
import {map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  list$: Observable<Favorite[]>;

  constructor(
    public authService: AuthService,
  ) {
    this.list$ = this.authService.user$.pipe(
      mergeMap(user => iif(
        () => !!user,
        of([{createDate: '1'}]),
        of([{createDate: '2'}]),
      )),
    );
  }

  ngOnInit(): void {
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

}
