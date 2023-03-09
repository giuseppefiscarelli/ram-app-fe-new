import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { forkJoin, Subscription } from 'rxjs';
import { IstanzeService } from '../../../istanze.service';

@Component({
  selector: 'app-type-dash',
  templateUrl: './type-dash.component.html',
  styleUrls: ['./type-dash.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeDashComponent implements OnInit {
    @Input() type:TypeIstance;
    value$: Subscription;
    totalIstanze = 0;
    activeIstanze = 0;
    rendActive =0;
    rendClosed = 0;
    rendCanceled  = 0;
    constructor(
      private service: IstanzeService,
      private changeDetectorRef: ChangeDetectorRef,
    ) {

     }

    ngOnInit() {
      this.value$ = forkJoin([
        this.service.countIstanze({total:true, type:this.type.id}),
        this.service.countIstanze({total:true,active:true,type:this.type.id}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendEnable'}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendClosed'}),
        this.service.countIstanze({total:true,type:this.type.id, rend:'rendCanceled'}),
    ]).subscribe(
        ([total,active,rendActive, rendClosed, rendCanceled]) => {
            this.totalIstanze =total;
            this.activeIstanze = active;
            this.rendActive = rendActive
            this.rendClosed = rendClosed;
            this.rendCanceled = rendCanceled;
            this.changeDetectorRef.markForCheck();
        }
    )
    }
    ngOnDestroy(): void {
      this.value$.unsubscribe()

   }

}
