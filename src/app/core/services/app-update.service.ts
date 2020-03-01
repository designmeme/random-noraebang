import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {first, tap} from 'rxjs/operators';
import {concat, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(
    updates: SwUpdate,
    appRef: ApplicationRef,
  ) {
    if (!updates.isEnabled) {
      return;
    }

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);

      // const snackBarRef = snackBar.open('앱 업데이트가 있습니다! 자동으로 화면을 다시 불러옵니다.', '바로 업데이트', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      // snackBarRef.afterDismissed().subscribe(() => {
      //   updates.activateUpdate().then(() => document.location.reload());
      // });
    });

    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    // Allow the app to stabilize first, before starting polling for updates with `timer()`.
    const appIsStable$ = appRef.isStable.pipe(
      first(isStable => isStable === true),
      tap(() => console.log('appIsStabled')),
    );
    const everySixHours$ = timer(0, 6 * 60 * 60 * 1000).pipe(
      tap(time => console.log('timer', time)),
    );
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => {
      updates.checkForUpdate();
      console.log('checkForUpdate');
    });
  }
}
