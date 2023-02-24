import { ProjectsService } from './../../projects.service';
import { Project } from './../../../../models/project.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, merge, Subscription } from 'rxjs';
import { Papa } from 'ngx-papaparse';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {
  dataSource: Project[];
  start: number = 0;
  limit: number = 25;
  filters: FormGroup;
  filters$: Subscription;
  data$: Subscription;
  end: number = this.limit + this.start;

  displayedColumns: string[] = ['id','status', 'internalCode', 'description', 'idCustomer', 'datePlan','date', 'time','action'];
  timeScroll:any;
  isLoading: boolean = true;
   //file

  fileName = '';
  fileAttach: File;
  selectedFiles?: File;



    constructor(  private service :ProjectsService,
                  private changeDetectorRef: ChangeDetectorRef,
                  private Papa: Papa) {

        this.timeScroll = null;
        this.dataSource = [];
        this.filters = new FormGroup({
            term: new FormControl(null),
            offset: new FormControl(this.start),
            enable: new FormControl('true'),
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
        this.getData(payload);
        this.filterObservable();
      }
      ngOnDestroy(): void {
        this.filters$.unsubscribe();

      }
      filterObservable():void{
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
      getData(payload){
        this.service.fetchProject(payload).subscribe(
            (res: Project[]) => {
              console.log(res, res.length)
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

      onClickEditBtn(mode, element?:Project, atIndex?:number){

      }
      uploadFile(event: any): void {
        console.log(event)
        this.fileAttach = event.target.files[0];
        //this.form.controls.attach.setValue(true)

        this.Papa.parse( this.fileAttach, {
            header: true,
            skipEmptyLines: true,
            encoding: 'utf-8',
            dynamicTyping:true,
            complete: (result,file) => {
             console.log(result)
            }
          });
    }

    deleteFile(): void{
       this.fileAttach = null;
    }


}
