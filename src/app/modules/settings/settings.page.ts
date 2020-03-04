import {Component, Inject, OnInit} from '@angular/core';
import {APP_VERSION} from '@angular/fire/analytics';
import {AuthService} from '../../core/services/auth.service';
import { AlertController } from '@ionic/angular';
import {User} from 'firebase';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  get mailto() {
    const subject = encodeURIComponent(`[랜덤노래방]개발자에게 메일 보내기`);
    const body = encodeURIComponent(`



      아래 정보를 함께 보내주세요--------------
      appVersion: ${this.version}
      platform: ${navigator.platform}
      vendor: ${navigator.vendor}
      userAgent: ${navigator.userAgent}
    `);
    return `mailto:ghe.lee@gmail.com?subject=${subject}&body=${body}`;
  }

  constructor(
    public authService: AuthService,
    @Inject(APP_VERSION) public version: string,
    private alertController: AlertController

  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login()
      // .then(result => console.log('signInWithPopup result', result))
      .catch(error => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;
        console.error('signInWithPopup error', error);
      });
  }

  logout() {
    this.alertController.create({
      header: '로그아웃',
      message: '로그아웃하시겠어요?',
      buttons: [
        {
          text: '아니요',
          role: 'cancel',
        }, {
          text: '예',
          handler: () => {
            this.authService.logout()
              // .then(result => console.log('signout result', result))
              .catch(error => console.error('signout error', error));
          }
        }
      ]
    }).then(alert => alert.present());
  }


  delete(user: User) {
    this.alertController.create({
      header: '탈퇴하기',
      message: '탈퇴하시겠어요?<br>계정 정보가 즉시 삭제됩니다.',
      buttons: [
        {
          text: '아니요',
          role: 'cancel',
        }, {
          text: '예',
          handler: () => {
            user.delete()
              .then(() => {
                this.alertController.create({
                  header: '탈퇴하기 완료',
                  message: '탈퇴처리가 완료되었어요. 계정 정보를 삭제했습니다.',
                  buttons: [{ text: '확인' }],
                }).then(alert => alert.present());
              })
              .catch(error => {
                if (error.code === 'auth/requires-recent-login') {
                  this.alertController.create({
                    header: '재로그인 필요',
                    message: '안전한 탈퇴를 위해 재로그인이 필요해요.<br>다시 로그인 후 탈퇴하기를 시도해주세요.',
                    buttons: [{ text: '확인' }],
                  }).then(alert => alert.present());
                } else {
                  this.alertController.create({
                    header: '탈퇴하기 실패',
                    message: `에러가 발생했어요. 다시 시도해주세요. ${error.code}`,
                    buttons: [{ text: '확인' }],
                  }).then(alert => alert.present());
                }
              });
          }
        }
      ]
    }).then(alert => alert.present());
  }

}
