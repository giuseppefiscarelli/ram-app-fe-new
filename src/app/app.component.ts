import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { currentBrowserLanguage } from './modules/translations/translations.config';
import { SwUpdate, UpdateAvailableEvent, VersionEvent } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ng-ram-14';
  constructor(private translation: TranslateService,private swUpdate: SwUpdate) {
    this.translation.setDefaultLang(currentBrowserLanguage());
    //console.log(currentBrowserLanguage());
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
       console.log('swevent',event)
       if(event.type ==='VERSION_READY'){
            if(confirm("New version available. Load New Version?")) {

        window.location.reload();
    }
       }
    //    if(confirm("New version available. Load New Version?")) {

    //     window.location.reload();
    // }
       });

      // Controlla se ci sono aggiornamenti disponibili
      this.swUpdate.checkForUpdate();
    }
}
}
