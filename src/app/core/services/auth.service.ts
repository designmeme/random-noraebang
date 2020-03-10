import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth as fireAuth} from 'firebase/app';
import {catchError, map} from 'rxjs/operators';

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
    try {
      // https://firebase.google.com/docs/auth/web/auth-state-persistence#overview_of_persistence_behavior
      // 로그인 유지하기 설정
      await this.auth.auth.setPersistence(fireAuth.Auth.Persistence.LOCAL);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode + errorMessage);
    }

    return await this.auth.auth.signInWithPopup(new fireAuth.GoogleAuthProvider());
  }

  async logout() {
    return await this.auth.auth.signOut();
  }
}
