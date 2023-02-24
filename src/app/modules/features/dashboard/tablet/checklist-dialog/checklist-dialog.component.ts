import { ProjectsService } from './../../../projects/projects.service';
import  Swal  from 'sweetalert2';
import { NotificationsComponent } from '@app/modules/notifications/notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Task } from '@app/modules/models/task.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { Employee } from '@app/modules/models/employee.model';
import { TYPE } from '@app/modules/notifications/values.constants';

@Component({
  selector: 'app-checklist-dialog',
  templateUrl: './checklist-dialog.component.html',
  styleUrls: ['./checklist-dialog.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
},ProjectsService]
})
export class ChecklistDialogComponent implements OnInit {
  mode: string;
task: Task
checkList = [];
form: FormGroup;
isLoading = true;
operatorsData: Employee[];
typeOperationData:any[];
dialogTitle: string;
btnSumbitText: string;
    constructor(
                  @Inject(MAT_DIALOG_DATA) public data: any,
                  private dialogRef: MatDialogRef<ChecklistDialogComponent>,
                  private snackbar: MatSnackBar,
                  private notification : NotificationsComponent,
                  private projectService: ProjectsService
                )
                {
                  this.mode = data.mode;
                  this.dialogTitle = 'Check List Termine attività';
                  this.btnSumbitText = 'Salva Checklist e concludi attività';
                  this.task = data.task;
                  this.typeOperationData = data.typeOperationData;
                  this.operatorsData = data.operatorsData;
                  this.checkList = this.task.checkList;
                  if(this.mode === 'edit-operation'){
                    this.dialogTitle = 'Termina operazioni in lavorazione';
                    this.btnSumbitText = 'Termina lavorazioni';
                    this.checkList = this.task.checkList.filter((x)=> x.status ==='inprogress');
                  }

                  if(this.mode === 'create-operation'){
                    this.dialogTitle = 'Avvia Lavorazioni programmate';
                    this.btnSumbitText = 'Avvia lavorazioni';
                    this.checkList = this.task.checkList.filter((x)=> x.status ==='scheduled');
                  }

                  this.form = new FormGroup({});
                  this.checkList.map((item)=>this.form.addControl(item.type.toString(), new FormControl(false,[Validators.requiredTrue])))
                }

    ngOnInit(): void {

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);

    }
    onClickSubmit(){
      //console.log(this.mode)
      if(this.mode === 'edit-operation'){
        Object
        .keys(this.form.controls)
        .map((key: string) => {
          this.task.checkList.find(
            (x,i,arr) =>{
              if(x.type === key && this.form.get(key).value === true){
                x.status = 'completed';
                x.end = new Date().getTime().toString();
                let minPause = 0;
                if( this.task.interval && this.task.interval.length > 0){
                  this.task.interval.map((int) => {if(Number(int.start) > Number(x.start) ){minPause += int.totalMin;}})
                }
                x.totalMin = (Math.floor((Number(x.end) - Number(x.start))/1000/60)) - minPause;
              }
            }
          )
        });

        const operationCompleted = this.task.checkList.filter(x=> x.status === 'completed').length === this.task.checkList.length?true:false;

        //console.log(operationCompleted)
        if(!operationCompleted){
          Swal.fire({
            title:'Vuoi Iniziare altre Lavorazioni?',
            text: 'Clicca OK per confermare',
            icon:TYPE.INFO,
            showCancelButton: true,
            cancelButtonText:'Chiudi',
            confirmButtonText: 'OK'
          }).then(
            (result)=> {
              if(result.isConfirmed){
                //this.dialogRef.close(this.task.checkList)
                //console.log(this.task)
                  this.projectService.updateTask(this.task).subscribe(
                    (res) =>{
                      //console.log(this.task)
                      //console.log(res)
                      this.task=res;
                       this.notification.toast(TYPE.SUCCESS,'Operazione Completata','Lavorazione conclusa con successo');
                       this.mode = 'create-operation'
                       this.dialogTitle = 'Avvia Lavorazioni programmate';
                       this.btnSumbitText = 'Avvia lavorazioni';
                       this.checkList = this.task.checkList.filter((x)=> x.status ==='scheduled');
                       this.form = new FormGroup({});
                       this.checkList.map((item)=>this.form.addControl(item.type.toString(), new FormControl(false,[Validators.requiredTrue])))


                      }
                  );


              }else{
                this.dialogRef.close(this.task)
              }
            }
          );
        }else{
          this.dialogRef.close(this.task)
        }


      }
      else
      if(this.mode === 'create-operation'){
       // console.log(this.task)
        Object
        .keys(this.form.controls)
        .map((key: string) => {
          this.task.checkList.find(
            (x,i,arr) =>{
              if(x.type === key && this.form.get(key).value === true){
                x.status = 'inprogress';
                x.start = new Date().getTime().toString()
              }
            }
          )
        });
        //console.log(this.task)
        this.dialogRef.close(this.task)
      }
      else{
        if(this.form.invalid){
          this.notification.toast(TYPE.WARNING,'Attenzione!','Si prega di completare tutte le lavorazioni!')
          }
        if(this.form.valid){
          this.checkList.map(
            (x)=> {
              x.status = 'completed';
              x.start = this.task.dateStart
              x.end = new Date().getTime().toString()
            }
          );
         // this.dialogRef.close(this.checkList);
        }
      }
    }
    getTypeOperationsData(key){
        return this.typeOperationData.find(x=>x.key===key).value;
    }
    getOperatorsData(idUser){
      const data = this.operatorsData.find(x=> x.id === idUser)
      return `${data.surname} ${data.name}`
    }
}
