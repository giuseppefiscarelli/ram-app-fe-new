import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { statusCheck } from '@app/app.costants';
import { ApplicationState } from '@app/app.state';
import { IstanzaCheck } from '@app/modules/models/istanzacheck.model';
import { Store } from '@ngrx/store';
import { IstanzeService } from '../../../istanze.service';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-check-cert-dialog',
  templateUrl: './check-cert-dialog.component.html',
  styleUrls: ['./check-cert-dialog.component.scss']
})
export class CheckCertDialogComponent implements OnInit {
  form: FormGroup;

  statusCheck:statusCheck;

  filterOptionsDescriptors: {
   [key: string]: any
   };
   istanzaCheck:IstanzaCheck;

  dialogTitle: string;
  btnSubmit: string;
  btnClose: string;
  type:any;
  allegati : any[]
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
                private services: IstanzeService,
                private changeDetectorRef: ChangeDetectorRef,
                private store: Store<ApplicationState>,
                private dialogRef: MatDialogRef<CheckCertDialogComponent>,
                private notifications: NotificationsComponent,
                private route: ActivatedRoute,
                private router: Router
    ) {
      this.type = data.data;
      this.allegati = data.allegati;
      this.istanzaCheck = data.istanzaCheck
      this.filterOptionsDescriptors = {
          statusCheck: [

          ]
      };

      Object.keys(statusCheck)
      .filter(x => x === 'ACCEPTED' || x === 'PENDING' || x === 'REJECTED')
      .map((status: string) => (

          this.filterOptionsDescriptors.statusCheck.push(
              {
                  title: statusCheck[status],
                  value: statusCheck[status],
                  disabled: true,

              }
          )
      ));

      this.dialogTitle = 'Certificazione Dichiarazione';
      this.btnSubmit= 'Aggiorna informazioni e stato lavorazione';
     }

    ngOnInit(): void {
      this.form = this.initializeForEdit(this.istanzaCheck)
    }

    initializeForEdit(ic:IstanzaCheck):FormGroup{
      return new FormGroup({
          id: new FormControl(ic.id),
          id_ram: new FormControl(ic.id_ram),
          contratto: new FormControl(ic.contratto),
          noteContratto: new FormControl(ic.noteContratto),
          delega: new FormControl(ic.delega),
          noteDelega: new FormControl(ic.noteDelega),
          dimImpresa: new FormControl(ic.dimImpresa),
          noteDimImpresa: new FormControl(ic.noteDimImpresa),
          doc: new FormControl(ic.doc),
          noteDoc: new FormControl(ic.noteDoc),
          firma: new FormControl(ic.firma),
          noteFirma: new FormControl(ic.noteFirma),
          pec: new FormControl(ic.pec),
          notePec: new FormControl(ic.notePec),



      })
  }
  onSubmitBtn(){
      Object
      .keys(this.form.controls)
      .map((key: string) => this.form.get(key))
      .forEach((control: AbstractControl) => {
          control.markAsDirty();
          control.markAsTouched();
      });

      if (this.form.valid){
          const payload = this.form.value;
         // console.log(payload)
          Object.keys(payload).forEach(key => {
              if (payload[key] === undefined || payload[key] === null ) {
                  delete payload[key];
              }
          });

          this.services.updateIstanzaCheck(payload).subscribe(
              (res) => {
                  this.notifications.toast(
                    TYPE.SUCCESS,
                      'Operazione completata',
                      'Certificazione aggiornata con successo'
                  );
                  this.dialogRef.close(res)
              }
          )
      }
  }
  capitalizeNote(s){
      return 'note'+s[0].toUpperCase() + s.slice(1);
  }
  getDataImpresa(dim){
      const alleData = this.allegati.find(x=> x.typeDocument === 'pmi' && x.adminState === 'accepted')
     // console.log(dim, alleData)
      if(dim === 1){
          if(alleData.jsonData['unita_lavorative'] < 50 && alleData.jsonData['volumi_fatturato'] < 10000000){
              return false
          }
      }
      if(dim === 2){
          if(
              (alleData.jsonData['unita_lavorative'] >= 50 && alleData.jsonData['unita_lavorative']< 250)
              && (alleData.jsonData['volumi_fatturato'] >= 10000000 && alleData.jsonData['volumi_fatturato'] < 50000000)){

              return false
          }
      }
      if(dim === 3){
          if(alleData.jsonData['unita_lavorative'] >= 250 || alleData.jsonData['volumi_fatturato'] >= 50000000){
              return false
          }
      }

      return true
  }

}
