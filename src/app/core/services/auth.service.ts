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

  login() {
    this.auth.auth.signInWithPopup(new fireAuth.GoogleAuthProvider())
      .then(data => console.log('signInWithPopup', data))
      .catch(error => console.error('signInWithPopup', error));
  }

  logout() {
    this.auth.auth.signOut()
      .then(data => console.log('signout', data))
      .catch(error => console.error('signout', error));
  }
}
