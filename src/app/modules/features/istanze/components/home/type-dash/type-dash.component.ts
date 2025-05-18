import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { forkJoin, Subscription } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';

@Component({
  selector: 'app-type-dash',
  templateUrl: './type-dash.component.html',
  styleUrls: ['./type-dash.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeDashComponent implements OnInit, OnChanges {
    @Input() type:TypeIstance;
    value$: Subscription;
    totalIstanze = 0;
    activeIstanze = 0;
    rendActive =0;
    rendClosed = 0;
    rendCanceled  = 0;
    rendExpired = 0;
    expired:boolean=false;
    today:Date;
    constructor(
      private service: IstanzeService,
      private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.today = new Date();
     }

    ngOnInit() {



    }
    ngOnDestroy(): void {
      this.value$.unsubscribe()

   }
   ngOnChanges(changes: SimpleChanges): void {
      // console.log(changes)
       if(changes['type'] && changes['type'].currentValue){
        this.type = changes['type'].currentValue
        this.today = new Date();
     //   console.log(this.today)
       // console.log('oggi:'+this.today.getTime().toString(), this.type.reportingEndDate)
        if(this.today.getTime().toString() > this.type.reportingEndDate){
          this.expired =true;
        }

      this.value$ = forkJoin([
        this.service.countIstanze({total:true, type:this.type.id }),
        this.service.countIstanze({total:true,active:true,type:this.type.id}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendEnable'}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendClosed'}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendExpired'}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendCanceled'}),
    ]).subscribe(
        ([total,active,rendActive, rendClosed,rendExpired, rendCanceled]) => {
            this.totalIstanze =total;
            this.activeIstanze = this.expired?0:active;
            this.rendActive = this.expired?0:rendActive
            this.rendClosed = rendClosed;
            this.rendCanceled = rendCanceled;
            this.rendExpired = this.expired?rendExpired:0;

            this.changeDetectorRef.markForCheck();
        }
    )
       }
   }

}
