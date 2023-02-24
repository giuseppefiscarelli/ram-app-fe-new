import { NavbarComponent } from './../../../../components/navbar/navbar.component';
import { Fitok } from './../../../models/fitok';
import { Desk } from '../../../models/desk';
import { Operator } from '../../../models/operator';



import { MonitoringService } from './../monitoring.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, forkJoin, merge, Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-phase-edit',
  templateUrl: './phase-edit.component.html',
  styleUrls: ['./phase-edit.component.scss'],
  providers:[NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseEditComponent implements OnInit, OnDestroy {


  dropOperator: Operator[];
  dropDesk: Desk[];
  data$: Subscription;
  mode:string;
  form: FormGroup;
  minDate: Date;
  minTimeA: string;
  minTimeB: string;
  minTimeC: string;
  showStart= true;
  showPause=false;
  showEnd =false;
  observable$: Subscription;
  interval:{
    start: number;
    end: number;
    problemcheck:boolean;
  }[];
  insertPause: boolean;
  enablePause: boolean;

  record:{
    phaseStartDate?: number;
    phaseEndDate?: number;
    operator?: string;
    desk?: string;
    pause?:{
      start:number;
      end: number;
      problemcheck: number;
    }[];
    totalTime?: number;
    fitok?: string;
  };
  summary:false;
  fitok: Fitok;


  ///table
  displayedColumns: string[] = ['id','desk', 'operator', 'fitok', 'start', 'end', 'pause','typePause','duration'];
  dataSource: any;
  timeScroll:any;
  showTable = false;
  loadingTable = false;
  modeView:{value: string, icon: string}[];
  view: string;

  //tablet

  startBtn=false;
  startPauseBtn=false;
  endPauseBtn=false;
  endBtn=false;
  formFitok = true;
  tabletSummary= false;
  statusTablet:string;

  constructor( private service: MonitoringService,
               private dateAdapter: DateAdapter<any>,
               private changeDetectorRef: ChangeDetectorRef,
               private snackbar: MatSnackBar,
               private nav: NavbarComponent) {
    this.dateAdapter.setLocale('it-IT');
    this.modeView=[
      {value:'desktop', icon:'computer'},
      {value:'mobile', icon:'tablet_mac'}
    ];
    this.view ='desktop';
    this.record = {};
    this.record.pause=[];
    this.dataSource = [];
    this.dropDesk = this.dropOperator = this.interval= [];
    this.data$ = forkJoin([
      this.service.getOperators(),
      this.service.getDesks()
    ]).subscribe(
      ([operator,desk]) => {
        this.dropDesk = desk;
        this.dropOperator = operator;
      }
    )
    this.form = this.initializeForCreate()
  }
  onChange(event){
    if(event){
      this.view = event.value;
    }
  }

  ngOnInit(): void {
    this.createObservable()
  }
  ngOnDestroy(): void {
      this.data$.unsubscribe()
  }

  initializeForCreate(): FormGroup{
    this.insertPause = this.enablePause = false;
    return new FormGroup({
      desk: new FormControl(null),
      operator: new FormControl(null),
      fitok: new FormControl(null),
      dateStart: new FormControl(null),
      timeStart: new FormControl(null),
      pauseStart: new FormControl(null),
      timePauseStart: new FormControl(null),
      pauseEnd: new FormControl(null),
      timePauseEnd: new FormControl(null),
      dateEnd: new FormControl(null),
      timeEnd: new FormControl(null),
      problemcheck: new FormControl(false)
    });

  }
  createObservable(){
    this.form.controls.dateStart.valueChanges.subscribe(
      (res)=> {
        this.minDate = new Date(res);
        this.showPause = this.enablePause = true;
      }
    )
    this.form.controls.fitok.valueChanges
    .pipe(debounceTime(2000))
    .subscribe(
      (value)=>{
        this.record.fitok = value;
        this.dataSource = [];
        this.service.getByFitok(value).subscribe(
          (res: Fitok[]) => {
            if(res && res[0].PhasesEvents){
              this.fitok = res[0];
              this.dataSource = res[0].PhasesEvents;
              this.showTable= true;
              this.changeDetectorRef.markForCheck();
              this.startBtn = true;
            }
          }
        )
      }
    )

    this.form.valueChanges.subscribe(
      (val)=>
      {
        if(val.desk){
          this.record.desk = val.desk;
        }
        if(val.operator){
          this.record.operator = val.operator;
        }
        if (val.dateStart && val.timeStart){
          if(this.interval.length === 0 ){
            this.minTimeA = this.minTimeB = this.minTimeC = val.timeStart;
          }
          this.showEnd = this.enablePause =  true;
          this.record.phaseStartDate = new Date(val.dateStart).setHours(parseInt(val.timeStart.split(':')[0]),parseInt(val.timeStart.split(':')[1]),0,0);

        }
        if(val.pauseStart){
          this.enablePause = false;
          this.showEnd = false;
        }
        if (val.pauseStart && val.timePauseStart){
          this.minTimeB = this.minTimeC = val.timePauseStart;
        }
        if (val.pauseEnd && val.timePauseEnd){
          this.showEnd = true;
          this.minTimeC = val.timePauseEnd;
        }
        if (val.dateEnd && val.timeEnd){
          let start = new Date(val.dateStart).setHours(parseInt( val.timeStart.split(':')[0]),parseInt( val.timeStart.split(':')[1]),0,0);
          let end= new Date(val.dateEnd).setHours(parseInt(val.timeEnd.split(':')[0]),parseInt(val.timeEnd.split(':')[1]),0,0);
          this.record.phaseEndDate = end;

          let diff = end - start;
          var pause:number = 0;
          if(this.interval.length > 0){
            this.interval.map(
              (item)=> {
                pause += item.end - item.start
              }
            )
          }
          if (val.pauseStart && val.timePauseStart && val.pauseEnd && val.timePauseEnd){
            let startPause = new Date(val.pauseStart).setHours(parseInt( val.timePauseStart.split(':')[0]),parseInt( val.timePauseStart.split(':')[1]),0,0);
            let endPause  = new Date(val.pauseEnd).setHours(parseInt(val.timePauseEnd.split(':')[0]),parseInt(val.timePauseEnd.split(':')[1]),0,0);
              pause += endPause - startPause;
          }
          this.record.totalTime = diff-pause;
        }
      }
    )
  }

  onClickSubmit(): void{
    Object
    .keys(this.form.controls)
    .map((key: string) => this.form.get(key))
    .forEach((control: AbstractControl) => {
        control.markAsDirty();
        control.markAsTouched();
    });
    if(this.form.valid){
        let payload = this.form.getRawValue();
        payload.pause = [];
        let totMillisecondsPause = 0;
        if(this.interval.length > 0){
          payload.pause = [...payload.pause,...this.interval];
        }
        if (payload.pauseStart && payload.timePauseStart && payload.pauseEnd && payload.timePauseEnd){
          let start = payload.pauseStart;
          let startTime =payload.timePauseStart;
          let end = payload.pauseEnd;
          let endTime = payload.timePauseEnd;
          let problemcheck = payload.problemcheck;
          start = new Date(start).setHours(parseInt(startTime.split(':')[0]),parseInt(startTime.split(':')[1]),0,0);
          end= new Date(end).setHours(parseInt(endTime.split(':')[0]),parseInt(endTime.split(':')[1]),0,0);
          payload.pause.push({
            start: start,
            end,
            problemcheck
          });

        }
        payload.pause.map(
          (item) => {
              totMillisecondsPause += item.end - item.start
          }
        )
        payload.phaseStartDate = new Date(payload.dateStart).setHours(parseInt(payload.timeStart.split(':')[0]),parseInt(payload.timeStart.split(':')[1]),0,0);
        payload.phaseEndDate= new Date(payload.dateEnd).setHours(parseInt(payload.timeEnd.split(':')[0]),parseInt(payload.timeEnd.split(':')[1]),0,0);
        payload.totalTime = (payload.phaseEndDate - payload.phaseStartDate) - totMillisecondsPause;
        delete payload.dateStart;
        delete payload.timeStart;
        delete payload.dateEnd;
        delete payload.timeEnd;
        delete payload.pauseStart;
        delete payload.timePauseStart;
        delete payload.pauseEnd;
        delete payload.timePauseEnd;
        delete payload.problemcheck;
        this.fitok.PhasesEvents.push(payload)
        this.service.updateFitok(payload.fitok, this.fitok).subscribe({
          next:(res) => {

            this.dataSource = [...this.fitok.PhasesEvents];
            this.changeDetectorRef.detectChanges();
            this.form = this.initializeForCreate();
            this.form.controls.fitok.setValue(payload.fitok);
            this.snackbar.open('Fase Inserita correttamente!', 'X',{duration: 4000,panelClass: ["success-snack-style"]});

          },
          error: ()=>{this.snackbar.open('Errore Aggiornamento!', 'X',{duration: 4000,panelClass: ["error-snack-style"]});}
        })
    }
  }

  addInterval():void{
    let start = this.form.controls.pauseStart.value;
    let startTime =this.form.controls.timePauseStart.value;
    let end = this.form.controls.pauseEnd.value;
    let endTime = this.form.controls.timePauseEnd.value;
    let checkProblem = this.form.controls.problemcheck.value;
    start = new Date(start).setHours(parseInt(startTime.split(':')[0]),parseInt(startTime.split(':')[1]),0,0);
    end= new Date(end).setHours(parseInt(endTime.split(':')[0]),parseInt(endTime.split(':')[1]),0,0);
    this.interval.push({
        start,end, problemcheck:checkProblem
    })
    this.minTimeA = this.minTimeB = this.minTimeC = endTime;
    this.form.controls.pauseStart.setValue(null);
    this.form.controls.timePauseStart.setValue(null);
    this.form.controls.pauseEnd.setValue(null);
    this.form.controls.timePauseEnd.setValue(null);
    this.form.controls.problemcheck.setValue(false);
    this.changeDetectorRef.markForCheck()

  }

  countPause(arr){
    let mills = 0;
    if(arr.length > 0){arr.map((item)=>{if(item.start && item.end){mills += item.end - item.start}})}
    return mills;
  }

  onClickTabletAction(mode){

    console.log(mode);
    switch (mode) {
      case 'startPhase':
        this.formFitok = false;
        this.startBtn = false;
        this.startPauseBtn = this.endBtn = this.tabletSummary= true;
        this.statusTablet ='In Lavorazione';
        this.snackbar.open('Inizio Fase Inserita correttamente!', 'X',{duration: 4000,panelClass: ["success-snack-style"]});

        this.record.phaseStartDate = new Date().getTime();

        break;
      case 'startPause':
        this.statusTablet ='In Pausa';
        this.startPauseBtn = this.endBtn = false;
        this.endPauseBtn = true;
        this.snackbar.open('Inizio Pausa Inserita correttamente!', 'X',{duration: 4000,panelClass: ["success-snack-style"]});

        break;
      case 'endPause':
        this.startPauseBtn = this.endBtn = true;
        this.endPauseBtn =false;
        this.statusTablet ='In Lavorazione';
        this.snackbar.open('Fine Pausa Inserita correttamente!', 'X',{duration: 4000,panelClass: ["success-snack-style"]});

        break;
      case 'endPhase':
        this.statusTablet ='Completata';
        this.snackbar.open('Fine Fase Inserita correttamente!', 'X',{duration: 4000,panelClass: ["success-snack-style"]});
        this.startBtn = this.startPauseBtn = this.endPauseBtn = this.endBtn = this.tabletSummary =false;
        this.formFitok = true;
        this.form = this.initializeForCreate();
        break;

      default:
        break;
    }

  }






}
