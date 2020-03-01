import {Component, Inject, OnInit} from '@angular/core';
import {APP_VERSION} from '@angular/fire/analytics';
import {AuthService} from '../../core/services/auth.service';
import {Observable} from 'rxjs';

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
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

}
