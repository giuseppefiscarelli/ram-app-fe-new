import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@app/modules/models/user.model';
import { Observable, take } from 'rxjs';
import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-pdf-view-project',
  templateUrl: './pdf-view-project.component.html',
  styleUrls: ['./pdf-view-project.component.scss']
})
export class PdfViewProjectComponent implements OnInit {
  pdfSrc: any;
  attachData:{
    date,
    user,
    text
  }[];
  form: FormGroup;
  user: Observable<User>;
  userMe: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<ApplicationState>,
    private dialogRef: MatDialogRef<PdfViewProjectComponent>,

    ) {

    this.pdfSrc = data.url;
    this.attachData = data.attachData || [];
    this.user = this.store.pipe(
      select('authentication'),
      select('user')
  );
  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
this.form = this.initalizeForCreate()
   }

  ngOnInit(): void {

  }
  initalizeForCreate():FormGroup{
    return new FormGroup({
      date: new FormControl(),
      user: new FormControl(),
      note: new FormControl()
    })
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
      const payload = this.form.getRawValue();
      payload.date = new Date().getTime();
      payload.user = this.userMe.email;

      const updatedRecords = [...this.attachData].concat([payload]);
      this.attachData = [...updatedRecords];
      this.dialogRef.close(this.attachData)

    }
  }

}
