import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { currentBrowserLanguage } from './modules/translations/translations.config';
import { SwUpdate, UpdateAvailableEvent, VersionEvent } from '@angular/service-worker';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ng-ram-14';
  loading: boolean = false;
  newVersionAvailable: boolean = false;
  constructor(
    private translation: TranslateService,
    private swUpdate: SwUpdate,
    private router: Router) {
        this.translation.setDefaultLang(currentBrowserLanguage());
        //console.log(currentBrowserLanguage());

    }

    ngOnInit() {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd) {
          if (this.swUpdate.isEnabled) {
            console.log(this.swUpdate.isEnabled)
            // Controlla se ci sono aggiornamenti disponibili
            this.swUpdate.checkForUpdate();

            this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
              console.log('swevent', event)
              if (event.type === 'VERSION_READY' && !this.newVersionAvailable) {
                if (confirm("New version available. Load New Version?")) {
                  this.newVersionAvailable = true;
                  window.location.reload();
                }
              }
            });
          }
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      });
    }
}
