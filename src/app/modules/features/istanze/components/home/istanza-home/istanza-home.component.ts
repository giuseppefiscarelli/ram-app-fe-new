import { ApplicationState } from '@app/app.state';
import { select, Store } from '@ngrx/store';
import { ConfigService } from './../../../../config/config.service';
import { IstanzeService } from './../../../istanze.service';
import { Rendicontazione } from './../../../../../models/istanza.model';
import { TypeIstance } from './../../../../../models/type-istance.model';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@app/modules/models/user.model';
import { forkJoin, Observable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-istanza-home',
  templateUrl: './istanza-home.component.html',
  styleUrls: ['./istanza-home.component.scss'],
  providers:[ConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IstanzaHomeComponent implements OnInit {
  cardTilte = 'Le Mie Istanze';
  user: Observable<User>;
  userMe: User;

  istanze: any[];
  type: TypeIstance[];
  rendTotal :Rendicontazione[];

  value$: Subscription;
    totalIstanze = 0;
    activeIstanze = 0;
    rendActive =0;
    rendClosed = 0;
    rendCanceled  = 0;
    isLoading :boolean = true;
  constructor(
                private service: IstanzeService,
                private serviceConf: ConfigService,
                private store: Store<ApplicationState>,
                private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.istanze = [];
    this.type = [];
    this.user = this.store.pipe(select('authentication'), select('user'));
    this.user.pipe(take(1)).subscribe(
         {
        next:(me: User) => this.userMe = me,
        error:(err)=> console.log(err),
        complete:()=> {
            var searchData = {}
            if(this.userMe.role!=='user'){
                this.cardTilte = 'Dashboard';

                this.rendTotal=[];
                this.serviceConf.fetchTypeInstance().subscribe(
                    (res)=> {
                        this.type = res;
                       console.log(this.type)
        this.isLoading = false;
                        this.changeDetectorRef.markForCheck();
                    }
                );

            }
            else{


                this.value$ = forkJoin(
                    [
                     this.serviceConf.fetchTypeInstance(),
                     this.service.fetchIstanze(
                        {
                            userpec:this.userMe.email,
                            list:true
                        }),
                    ]
                 ).subscribe(
                     ([type,istanze])=>{
                         this.type = type;


                         this.istanze = istanze;
                         this.isLoading = false;
                         this.changeDetectorRef.markForCheck();
                     }
                 )
            }

        }
      }
    );
  }

  ngOnInit(): void {
  }


  getDataRendicontazione(id_ram): any{
    const data = this.service.getRendicontazione(id_ram).subscribe(
    (res: Rendicontazione) => { return res.status}
    )

  }
  getRendActive():any{
    const data = this.rendTotal.filter(x=> x.enable === true);
    console.log(data)
    return data.length;
  }
  initializeDataForWidget(): void{

  }
  getTypeInfo(id){
    return this.type.find(x=> x.id === id)
  }

}
