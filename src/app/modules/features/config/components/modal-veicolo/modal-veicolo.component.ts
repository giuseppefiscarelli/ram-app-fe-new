import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TypeDocument } from '@app/modules/models/typeDocument.model';

@Component({
  selector: 'app-modal-veicolo',
  templateUrl: './modal-veicolo.component.html',
  styleUrls: ['./modal-veicolo.component.scss']
})
export class ModalVeicoloComponent implements OnInit {
  mode: string;
  dialogTitle: string;
  btnSubmit: string;
  form: FormGroup;
  catVei:[];
  typeDocuments: TypeDocument[];
    constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalVeicoloComponent>) {
      this.mode = data.mode;
      this.catVei = data.catVei;
      this.typeDocuments = data.typeDocuments;
      console.log(data)
      if(this.mode === 'create'){
          this.dialogTitle = 'Inserimento Veicolo';
          this.btnSubmit= 'Salva';
          this.form = this.initializeForCreate();
      }
      if(this.mode ==='edit'){
          this.form = this.initializeForEdit(data.typeVei)
          this.dialogTitle = 'Aggiorna Veicolo';
          this.btnSubmit= 'Aggiorna';
      }
    }

    ngOnInit(): void {
    }
    private initializeForCreate(): FormGroup {
      return new FormGroup({
          catVei :new FormControl(null, [Validators.required]),
          description: new FormControl(null, [Validators.required]),
          longDescription: new FormControl(null),
          artDm: new FormControl(null, [Validators.required]),
          campoDb: new FormControl(null, [Validators.required]),
          typeDocument: new FormControl(null, [Validators.required]),
          grantValue: new FormControl(null, [Validators.required]),
      })

  }

  private initializeForEdit(data): FormGroup {
      return new FormGroup({
          catVei :new FormControl(data.catVei, [Validators.required]),
          description: new FormControl(data.description, [Validators.required]),
          longDescription: new FormControl(data.longDescription),
          artDm: new FormControl(data.artDm, [Validators.required]),
          campoDb: new FormControl(data.campoDb, [Validators.required]),
          typeDocument: new FormControl(data.typeDocument, [Validators.required]),
          grantValue: new FormControl(data.grantValue?data.grantValue:0, [Validators.required]),
      })
  }

  onSubmitBtn(mode): void{
      Object
  .keys(this.form.controls)
  .map((key: string) => this.form.get(key))
  .forEach((control: AbstractControl) => {
      control.markAsDirty();
      control.markAsTouched();
  });
  if(this.form.valid){
      const payload = this.form.value;
      this.dialogRef.close(payload)


  }
  }
  onToppingRemoved(topping) {
      const toppings = this.typeDocuments as TypeDocument[];
      this.removeFirst(toppings, topping);
      this.typeDocuments = toppings; // To trigger change detection
    }

    private removeFirst<T>(array: T[], toRemove: T): void {
      const index = array.indexOf(toRemove);
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
    getTypeDescription(type){
      return this.typeDocuments.find(x=> x.id === type)
    }

}
