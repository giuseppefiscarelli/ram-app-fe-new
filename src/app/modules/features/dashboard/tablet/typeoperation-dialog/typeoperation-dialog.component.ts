import { MatButtonModule } from '@angular/material/button';
import { Employee } from '@app/modules/models/employee.model';
import { Task } from '@app/modules/models/task.model';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-typeoperation-dialog',
  templateUrl: './typeoperation-dialog.component.html',
  styleUrls: ['./typeoperation-dialog.component.scss']
})
export class TypeoperationDialogComponent implements OnInit {
  task: Task;
  form: FormGroup;
  formOperator: FormGroup
  isLoading: boolean;
  operators: Employee[];
  showFieldEditOperators: boolean;
  editOperatorsBtnText: string;



    constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
                  private dialogRef: MatDialogRef<TypeoperationDialogComponent>,) {
      this.isLoading = false;
      this.task = data.task;
      this.operators = data.operators;
      this.showFieldEditOperators = false;
      this.editOperatorsBtnText ='Aggiungi o sotituisci operatori';
      this.formOperator = new FormGroup({
        operators: new FormControl(this.task.operators,[Validators.required]),
      });

      if(this.task.operators){
        this.task.operators.map(
          (item) =>   this.formOperator.addControl(item, new FormControl(false))
        )
      }


      this.form = new FormGroup({});
      this.task.checkList.map(
        (item)=>
          this.form.addControl(item.type, new FormControl(item.status === 'scheduled'?false:true))
      )

     }

    ngOnInit(): void {
      console.log(this.form)
    }
    getOperatorData(id){
      const data = this.operators.find(x=> x.id === id)
      return `${data.surname} ${data.name}`
    }
    editOperators(showFieldEditOperators){
      this.showFieldEditOperators = !showFieldEditOperators;
      const data = this.formOperator.controls.operators.value;
      this.task.operators = data;
      this.formOperator = new FormGroup({
        operators: new FormControl(this.task.operators,[Validators.required]),
      });
      if(this.task.operators){
        this.task.operators.map(
          (item) =>   this.formOperator.addControl(item, new FormControl(false))
        )
      }
      if(this.showFieldEditOperators){

        this.editOperatorsBtnText = 'Conferma operatori';
      }else{
        /* const data = this.formOperator.controls.operators.value;
        console.log(data);
        this.task.operators = data; */
        this.editOperatorsBtnText ='Aggiungi o sotituisci operatori';
      }
    }
    onClickSubmit(){
      console.log(this.form.getRawValue());
      const payload = this.form.getRawValue();
      const payloadOperators = this.formOperator.getRawValue();
      const now = new Date().getTime();
      this.task.checkList.map(
        (item) => {
          console.log(payload[item.type]);
          if(payload[item.type]){
            item.status ='inprogress';
            item.start = now;
          }
        }
      )
      this.dialogRef.close(this.task)

    }

}
