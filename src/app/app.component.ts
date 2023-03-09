import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { currentBrowserLanguage } from './modules/translations/translations.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ng-ram-14';
  constructor(private translation: TranslateService) {
    this.translation.setDefaultLang(currentBrowserLanguage());
    //console.log(currentBrowserLanguage())
}
}
