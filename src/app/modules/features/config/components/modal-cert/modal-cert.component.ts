import { Component, OnInit,Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-cert',
  templateUrl: './modal-cert.component.html',
  styleUrls: ['./modal-cert.component.scss']
})
export class ModalCertComponent implements OnInit {
    mode: string;
    dialogTitle: string;
    btnSubmit: string;
    form: FormGroup;

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,


      private dialogRef: MatDialogRef<ModalCertComponent>,

    ) {

      this.mode = data.mode;
      if(this.mode === 'create'){
          this.dialogTitle = 'Inserimento Tipo Allegato/Cartificazione';
          this.btnSubmit= 'Salva';
          this.form = this.initializeForCreate();
      }
      if(this.mode ==='edit'){
          this.form = this.initializeForEdit(data.attInstance)
          this.dialogTitle = 'Aggiorna Tipo Allegato/Cartificazione';
          this.btnSubmit= 'Aggiorna';
      }
    }

    ngOnInit(): void {
    }
    private initializeForCreate(): FormGroup {
      return new FormGroup({
          description: new FormControl(null, [Validators.required]),
          longDescription: new FormControl(null),
          upload: new FormControl(false, [Validators.required]),
          adminControl: new FormControl(false, [Validators.required]),
          adminNote: new FormControl(false, [Validators.required]),
          })
  }
  private initializeForEdit(data): FormGroup {
      return new FormGroup({
          description: new FormControl(data.description, [Validators.required]),
          longDescription: new FormControl(data.longDescription),
          upload: new FormControl(data.upload, [Validators.required]),
          adminControl: new FormControl(data.adminControl, [Validators.required]),
          adminNote: new FormControl(data.adminNote, [Validators.required]),
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


}
