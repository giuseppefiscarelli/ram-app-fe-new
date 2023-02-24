import { Subscription } from 'rxjs';
import { EmployeesService } from './../../../employees/employees.service';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from './../../users.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/modules/models/user.model';
import { UserRole } from '@app/app.costants';
import {CustomValidators} from '@modules/shared/validators/custom.validators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers:[EmployeesService]
})
export class EditComponent implements OnInit {
  userData: User;
  mode: string;
  type: any;
  form: FormGroup;
  dialogTitle: string;
  btnSubmit: string;
  roles: { value: string, label: string }[];

  data$: Subscription;
    constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
                  private dialogRef: MatDialogRef<EditComponent>,
                  private service: UsersService,
                  private empService: EmployeesService,
                  private dateAdapter: DateAdapter<any>,
                  private snackbar: MatSnackBar,
                  private translator: TranslateService,
                  ) {

                    this.dateAdapter.setLocale('it-IT');
                    this.mode = data.mode;
                    this.roles = Object
                    .keys(UserRole)
                    .map((role: string) => ({
                        value: UserRole[role],
                        label: this.translator.instant(`users.roles.${UserRole[role]}`)
                    }));
                    if (this.mode === 'create'){
                      this.dialogTitle = 'Inserimento Nuovo Utente';
                      this.btnSubmit = 'Salva';
                      this.form = this.initializeForCreate();
                    }
                    if (this.mode ==='edit'){
                      this.dialogTitle = 'Aggiornamento Dati Utente';
                      this.btnSubmit = 'Salva';
                    }

                   }

    ngOnInit(): void {
    }

    private initializeForCreate(): FormGroup{

      return new FormGroup({
        name: new FormControl(null, [Validators.required]),
        surname: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        role: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        confirm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        type:new FormControl(null, [Validators.required]),
      }, {
          validators: CustomValidators.fieldsEquals(['password', 'confirm'])
      });

    }

    onSubmitClick(): void {
      Object
          .keys(this.form.controls)
          .map((key: string) => this.form.get(key))
          .forEach((control: AbstractControl) => {
              control.markAsDirty();
              control.markAsTouched();
          });
          console.log(this.form)
      if (this.form.valid) {
          if (this.mode === 'edit') {
              const payload = this.form.value;
                  console.log(payload)

              if(!payload.password){
                  delete payload.password;
              }
              delete payload.confirm;

           /*    this.service
                  .update(payload).subscribe(
                      {
                       next: (user: User) => {

                      },
                      error:(error: any) => console.error(error)
                    }
                  ); */
          }
          if(this.mode === 'create'){
            const payload = this.form.value;
              this.service.create(payload).subscribe({
              next: (res:User) => {
                if(res.type === 'employee'){
                  this.empService.createEmployee({
                    idUser:res.id,
                    surname:res.surname,
                    name:res.name,
                    company:res.company,
                    enabled: true

                  }).subscribe();
                }
                  this.dialogRef.close(res);
                  this.snackbar.open('Utente inserito Correttamente!', 'X',{duration: 4000,panelClass: ["success-snack-style"]});

              }
            })

          }
      }
    }

}
