import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../../shared/shared.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mfa-info',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
  <h2 mat-dialog-title [innerText]="'Info atutenticazione doppio fattore'"></h2>
  <mat-dialog-content>
<p style="text-align:justify">
Per migliorare la sicurezza del nostro sistema, abbiamo introdotto una nuova modalità di accesso all’applicazione web basata sull’autenticazione a più fattori (MFA).
</p>
<p style="text-align:justify">
Questo sistema aggiunge un ulteriore livello di protezione, garantendo che solo tu possa accedere al tuo account.
</p>
<p style="text-align:justify">
Come funziona il nuovo sistema di accesso?
</p>
<p style="text-align:justify">
Inserisci le tue credenziali (username e password) come hai sempre fatto.<br>
Dopo aver inserito la password, ti verrà richiesto di verificare la tua identità con un codice di sicurezza.
<br>
Questo codice sarà generato da un'app autenticatrice che dovrai installare sul tuo smartphone (come Google Authenticator o Microsoft Authenticator).<br>
Cosa devi fare?
Al primo accesso, ti verrà chiesto di configurare il sistema MFA. Segui queste semplici istruzioni:
</p>
<ul>
  <li>Scarica e installa un'app autenticatrice sul tuo smartphone (se non ne hai già una).</li>
  <li>Scansiona il codice QR che ti verrà mostrato durante la configurazione.</li>

</ul>

<p style="text-align:justify">
Una volta configurato, ogni volta che accedi all’applicazione ti sarà richiesto di inserire il codice di verifica generato.<br>

Perché è importante?<br>
L'MFA garantisce una protezione maggiore per il tuo account, riducendo il rischio di accessi non autorizzati, anche nel caso in cui qualcuno venisse a conoscenza della tua password.

Se hai difficoltà o hai bisogno di supporto nella configurazione, non esitare a contattare il nostro team di assistenza all'indirizzo:
<a href="mailto:incentivoinvestimenti@ramspa.it?subject=Richiesta%20Informazioni%20MFA&body=Gentile%20team,%0D%0A%0D%0AVorrei%20ricevere%20maggiori%20informazioni%20su...">
incentivoinvestimenti@ramspa.it
</a>


.<br><br>

Grazie per la collaborazione e per il tuo contributo a mantenere sicuro il nostro sistema.
</p>
  </mat-dialog-content>
  <mat-dialog-actions>
  <button mat-button color="warn" mat-dialog-close><mat-icon>close</mat-icon> Chiudi</button>

</mat-dialog-actions>

  `,
  styleUrls: ['./mfa-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MfaInfoComponent { }
