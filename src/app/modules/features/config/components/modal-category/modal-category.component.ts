import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.scss']
})
export class ModalCategoryComponent implements OnInit {
    mode: string;
    dialogTitle: string;
    btnSubmit: string;
    form: FormGroup;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<ModalCategoryComponent>,) {
                  this.mode = data.mode;
                  if(this.mode === 'create'){
                      this.dialogTitle = 'Inserimento Categoria';
                      this.btnSubmit= 'Salva';
                      this.form = this.initializeForCreate();
                  }
                  if(this.mode ==='edit'){
                      this.form = this.initializeForEdit(data.catVei)
                      this.dialogTitle = 'Aggiorna Categoria';
                      this.btnSubmit= 'Aggiorna';
                  }
                 }

    ngOnInit(): void {
    }
    private initializeForCreate(): FormGroup {
      return new FormGroup({
          category :new FormControl(null, [Validators.required]),
          description: new FormControl(null, [Validators.required]),
          })
    }
    private initializeForEdit(data): FormGroup {
        return new FormGroup({
            category :new FormControl(data.category, [Validators.required]),
            description: new FormControl(data.description, [Validators.required]),
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
