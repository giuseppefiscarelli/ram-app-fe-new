import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApplicationState } from '@app/app.state';
import { ConfigService } from '@app/modules/features/config/config.service';
import { ReportService } from '@app/modules/features/config/report.service';
import { Istanza } from '@app/modules/models/istanza.model';
import { TypeReport } from '@app/modules/models/typeReport.model';
import { User } from '@app/modules/models/user.model';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-admin-report-edit',
  templateUrl: './admin-report-edit.component.html',
  styleUrls: ['./admin-report-edit.component.scss'],
  providers:[ReportService]
})
export class AdminReportEditComponent implements OnInit {
  user: Observable<User>;
  userMe: User;
  istanza: Istanza;
  dialogTitle: string;
   btnSubmit: string;
   btnClose: string;
   mode:string;
   typeReport:TypeReport;
   form: FormGroup;
   preview: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<ApplicationState>,
    private reportService: ReportService,

  ) {
    console.log(data)
    this.mode = data.mode;
    this.typeReport = data.typeReport;
    this.user = this.store.pipe(select('authentication'), select('user'));

    this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
    if(this.mode === 'generate'){

      this.istanza = data.istanza

      this.dialogTitle = 'Inserimento nuovo report - '+ this.typeReport.description;
      this.btnSubmit= 'Crea Report';

      this.form =this.initializeForCreate()

      this.form.patchValue({
        ragSociale:this.istanza.ragione_sociale,
        indirizzo:this.istanza.indirizzo_impr,
        numCivico:this.istanza.civico_impr,
        cap:this.istanza.cap_impr,
        citta:this.istanza.comune_impr,
        prov:this.istanza.prov_impr,
        pecImpresa:this.istanza.pec_impr,
        idRam:this.istanza.id_ram,
        year:this.typeReport['typeistance']['year'],
      })
      
    }

   }

  ngOnInit(): void {
  }
  initializeForCreate(): FormGroup{
    return new FormGroup(
      {
        numProt : new FormControl(null),
        dataProt: new FormControl(null),
        dataVerbale:new FormControl(null),
        ragSociale:new FormControl(null),
        indirizzo:new FormControl(null),
        numCivico:new FormControl(null),
        cap:new FormControl(null),
        citta:new FormControl(null),
        prov:new FormControl(null),
        pecImpresa:new FormControl(null),
        idRam:new FormControl(null),
        dataIdRam:new FormControl(null),
        year:new FormControl(null),
        detail: new FormArray([]),
        artAa: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        
        artAb: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artAc: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artAd: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artB1: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artB2: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artCa: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        
        artCb: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artCc: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        artD: new FormGroup({
          numero :new FormControl(null),
          importo:new FormControl(null),
          maggiorazioni:new FormControl(null),
          totale:new FormControl(null),
        }),
        totaleMaggiorazioni:new FormControl(null),
        totaleContributo:new FormControl(null),
        protPreavvisoRigetto:new FormControl(null),
        dataPreavvisoRigetto:new FormControl(null),
        dataNotaInammissibilita:new FormControl(null),
        motivazioneInammissibilita:new FormControl(null),

      }
    )
  }
  get myArrayControls() {
    return (this.form.get('detail') as FormArray).controls;
  }

  addControl() {
    const control = new FormControl('');
    (this.form.get('detail') as FormArray).push(control);
  }

  removeControl(index: number) {
    (this.form.get('detail') as FormArray).removeAt(index);
  }

  onSubmitBtn(){
    Object
    .keys(this.form.controls)
    .map((key: string) => this.form.get(key))
    .forEach((control: AbstractControl) => {
        control.markAsDirty();
        control.markAsTouched();
    });


    let payload = this.form.getRawValue();
    console.log(payload)

  }
  async previewDoc(){

    const dataDoc = this.form.getRawValue();
    const data =  await this.reportService.generateReport( this.typeReport.type,dataDoc);
    data.getDataUrl((dataUrl) => {
      this.preview = dataUrl;
    })
  }

}
