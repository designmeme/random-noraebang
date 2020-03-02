import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth as fireAuth} from 'firebase/app';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = this.auth.user;

  isLoggedIn$ = this.auth.user.pipe(
    map(user => !!user),
  );
  isNotLoggedIn$ = this.auth.user.pipe(
    map(user => user === null),
  );

  constructor(
    private auth: AngularFireAuth,
  ) {
  }

  async login() {
    return await this.auth.auth.signInWithPopup(new fireAuth.GoogleAuthProvider());
  }

  async logout() {
    return await this.auth.auth.signOut();
  }
}
