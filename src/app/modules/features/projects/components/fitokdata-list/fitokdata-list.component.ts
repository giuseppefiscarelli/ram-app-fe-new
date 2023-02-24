import { FitokdataViewComponent } from './../fitokdata-view/fitokdata-view.component';
import { Project } from './../../../../models/project.model';
import { ProjectsService } from './../../projects.service';
import { FitokData } from './../../../../models/fitokData.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, merge, Observable, Subscription } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-fitokdata-list',
  templateUrl: './fitokdata-list.component.html',
  styleUrls: ['./fitokdata-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FitokdataListComponent implements OnInit {
  dataSource: FitokData[];
  fitok: FitokData;
  project: Project;
  start: number = 0;
  limit: number = 25;
  filters: FormGroup;
  filters$: Subscription;
  data$: Subscription;
  end: number = this.limit + this.start;

  timeScroll:any;
  isLoading: boolean = true;
  displayedColumns: string[] = ['id','fitok','action'];
  showPage=false;
  @ViewChild(FitokdataViewComponent, {static: false}) childRef: FitokdataViewComponent;
  constructor(private service: ProjectsService,
    private changeDetectorRef: ChangeDetectorRef) {
      this.fitok = null;
      this.timeScroll = null;
        this.dataSource = [];
        this.filters = new FormGroup({
            term: new FormControl(null),
            offset: new FormControl(this.start),

            limit: new FormControl(this.limit)
        });
       }


  ngOnInit(): void {
    const payload = {...this.filters.value};
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
                delete payload[key] ;
            }
        });
       // this.getData(payload);
        this.filterObservable();
  }
  ngOnDestroy(): void {
    this.filters$.unsubscribe();

  }
  filterObservable():void{
    if(!this.showPage){
      this.filters$ = merge(
        this.filters.controls.term.valueChanges,
       )
       .pipe(debounceTime(400))
       .subscribe(
        (value) => {

            this.start = 0;
            this.limit = 25;
            this.end =  this.limit + this.start;
            this.filters.controls.offset.setValue(this.start)
            this.filters.controls.limit.setValue(this.limit)
            const payload = {...this.filters.value};
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
                    delete payload[key] ;
                }
            });
            this.dataSource = []
            this.getData(payload);

        }
    );
    }



  }

  updateIndex() {

    this.start = this.end;
    this.end = this.limit + this.start;
    this.filters.patchValue({offset: this.start,limit: this.limit});
  }
  timeoutScroll(event){
    if(this.timeScroll){ clearTimeout(this.timeScroll);

    }
    this.timeScroll = setTimeout(() => {
        this.onTableScroll(event)
    }, 400);
  }
  onTableScroll(e) {

    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    const buffer = 100;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    const payload = this.filters.value;
    Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === ''|| payload[key] === null ) {
            delete payload[key] ;
        }
    });
    if (scrollLocation > limit && this.dataSource.length == this.start) {
        this.getData(payload);
    }
  }
  getData(payload){
    this.service.fetchFitokData(payload).subscribe(
        (res: FitokData[]) => {

            if(res && res.length > 0){
                let data = res;
                this.dataSource = this.dataSource.concat(data);
                this.isLoading = false;
                this.updateIndex();
                this.changeDetectorRef.markForCheck();
            }
            if(res.length === 0){
              this.isLoading = false;
              this.changeDetectorRef.markForCheck();
            }

        }
    )
  }

  selectedFitok(event, option){

    this.fitok = option;
    this.service.getProject(this.fitok.fitok).subscribe(
      {
        next:(res:Project) => this.project = res,
        complete: ()=>{
          if(this.childRef){
            this.childRef.ngOnDestroy()
          }
          this.showPage = true;
          this.changeDetectorRef.markForCheck()
        }
      })
  }

}
