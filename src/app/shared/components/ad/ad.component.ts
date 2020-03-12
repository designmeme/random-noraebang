import {AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild} from '@angular/core';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit, AfterViewInit {

  showKakaoFit = false;
  showAdsense = false;

  constructor(
    private renderer2: Renderer2,
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    if (isPlatformServer(this.platformId)) {
      return;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.initKakaoFit();
    this.initCoopangAd();
    // this.initAdsense();
  }

  private initAdsense() {
    this.showAdsense = true;

    const script = this.renderer2.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    };

    this.renderer2.appendChild(this.element.nativeElement, script);
  }

  private initKakaoFit() {
    this.showKakaoFit = true;

    const script = this.renderer2.createElement('script');
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    // script.onload = () => {
    // };

    this.renderer2.appendChild(this.element.nativeElement, script);
  }

  private initCoopangAd() {
    const script = this.renderer2.createElement('script');
    script.src = 'https://ads-partners.coupang.com/g.js';
    script.async = true;
    script.onload = () => {
      this.getAd();
    };

    this.renderer2.appendChild(this.element.nativeElement, script);
  }

  private getAd() {
    const script = this.renderer2.createElement('script');
    // 152204 - 노래방
    // 152140 - 고객 관심
    const ids = [152204, 152140];

    script.text = `
        new PartnersCoupang.G({
          id: ${ids[Math.floor(Math.random() * ids.length)]},
          width: '100%',
          height: 80,
          bordered: false,
          container: 'app-ad',
          subId: 'randomNoraebang',
        });
      `;

    this.renderer2.appendChild(this.element.nativeElement, script);
  }

}
