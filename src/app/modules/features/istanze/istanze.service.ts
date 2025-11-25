import { TypeDocumentsFactory } from './../../models/factories/typeDocuments.factory';
import { TypeDocument } from './../../models/typeDocument.model';
import { RendicontazioneFactory } from './../../models/factories/rendicontazione.factory';
import { Rendicontazione } from './../../models/istanza.model';
import { AllegatoFactory } from './../../models/factories/allegato.factory';
import { Allegato } from './../../models/allegato.model';
import { VeicoloFactory } from './../../models/factories/veicolo.factory';
import { Veicolo } from './../../models/veicolo.model';
import { IstanzaCheckFactory } from './../../models/factories/istanzacheck.factory';
import { IstanzaCheck } from './../../models/istanzacheck.model';
import { TypeIstanceFactory } from './../../models/factories/typeIstance.factory';
import { TypeIstanceDescriptorInterface, IstanzeDescriptorInterface, VeicoloDescriptorInterface, AllegatoDescriptorInterface, RendicontazioneDescriptorInterface, TypeDocumentsDescriptorInterface, IstanzaCheckDescriptorInterface } from './../../../config/network/api.descriptors';
import { TypeIstance } from './../../models/type-istance.model';
import { istanzaFactory } from './../../models/factories/istanza.factory';
import { Istanza } from './../../models/istanza.model';

import { Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@app/modules/network/api.service';

import { map } from 'rxjs/operators';

import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class IstanzeService {
    ipAddress: any;
    urlAddress: string;

    constructor(    private API: ApiService,
                    private http: HttpClient,
                    private handler: HttpBackend) {
                    this.http = new HttpClient(handler);
                    this.getIPAddress();
    }

    public getIPAddress(){
        this.http.get<{ip: string}>('https://jsonip.com')
        .subscribe( data => {
            this.ipAddress =data.ip
            return this.ipAddress
        });
    }

    fetchIstanze(payload?:any): Observable<any[]>{
        return this.API.Istanza.fetch(payload)
        /* .pipe(
            map((records: IstanzeDescriptorInterface[]) =>
            records.map((record: IstanzeDescriptorInterface) =>
            istanzaFactory.create(record)))
        );*/
    }

    countIstanze(payload?:any): Observable<any>{
        return this.API.Istanza.fetch(payload)
        /* .pipe(
            map((records: IstanzeDescriptorInterface[]) =>
            records.map((record: IstanzeDescriptorInterface) =>
            istanzaFactory.create(record)))
        );*/
    }

    getIstanza(id: string): Observable<Istanza> {
      //  console.log(id)
        return this.API.Istanza.get({id})
            .pipe(
                map((subject: IstanzeDescriptorInterface) => istanzaFactory.create(subject))
            );
    }

    getTypeInstance(id): Observable<TypeIstance> {
        return this.API.TypeInstance.get({id})
            .pipe(
                map((subject: TypeIstanceDescriptorInterface) => TypeIstanceFactory.create(subject))
            );
    }

    //istanzacheck
    getIstanzaCheck(id_ram: string): Observable<IstanzaCheck> {
        return this.API.IstanzaCheck.get({id_ram})
            .pipe(
                map((subject: IstanzaCheckDescriptorInterface) => IstanzaCheckFactory.create(subject))
            );
    }

    updateIstanzaCheck(payload: IstanzaCheckDescriptorInterface): Observable<IstanzaCheck> {
        return this.API.IstanzaCheck.update(payload)
            .pipe(
                map((record: IstanzaCheckDescriptorInterface) => IstanzaCheckFactory.create(record))
            );
    }

    //veicoli
    fetchVeicoli(payload?:any): Observable<Veicolo[]> {
        return this.API.Veicolo.fetch(payload)
        .pipe(
            map((records: VeicoloDescriptorInterface[]) =>
            records.map((record: VeicoloDescriptorInterface)=>
             VeicoloFactory.create(record))
            )
        );
    }

    getVeicolo(id): Observable<Veicolo> {
        return this.API.Veicolo.get({id})
        .pipe(
            map((record: VeicoloDescriptorInterface) =>
            VeicoloFactory.create(record))
        );
    }

    createVeicolo(payload: any): Observable<Veicolo> {
        return this.API.Veicolo.create(payload)
            .pipe(
                map((record: VeicoloDescriptorInterface) => VeicoloFactory.create(record))
            );
    }

    updateVeicolo(payload: VeicoloDescriptorInterface): Observable<Veicolo> {
        return this.API.Veicolo.update(payload)
            .pipe(
                map((record: VeicoloDescriptorInterface) => VeicoloFactory.create(record))
            );
    }

    //allegati
    fetchAllegati(payload?:any): Observable<Allegato[]> {
        return this.API.Allegato.fetch(payload)
        .pipe(
            map((records: AllegatoDescriptorInterface[]) =>
            records.map((record: AllegatoDescriptorInterface)=>
                AllegatoFactory.create(record))
            )
        );
    }

    getAllegato(id): Observable<Veicolo> {
        return this.API.Allegato.get({id})
        .pipe(
            map((record: AllegatoDescriptorInterface) =>
            AllegatoFactory.create(record))
        );
    }

    createAllegato(payload: any): Observable<Allegato> {
        return this.API.Allegato.create(payload)
            .pipe(
                map((record: AllegatoDescriptorInterface) => AllegatoFactory.create(record))
            );
    }

    uploadAllegato(file:File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.API.Upload.create(formData)
        .pipe(
            map((response: any) => response)
        );
    }

    updateAllegato(payload: AllegatoDescriptorInterface): Observable<Allegato> {
        return this.API.Allegato.update(payload)
            .pipe(
                map((record: AllegatoDescriptorInterface) => AllegatoFactory.create(record))
            );
    }

    getFile(file: any): Observable<any> {
        return this.API.Download.get(file, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });

    }
    //rendicontazione
    fetchRendicontazione(payload?:any): Observable<Rendicontazione[]>{
        return this.API.Rendicontazione.fetch(payload)
        .pipe(
            map((types: RendicontazioneDescriptorInterface[]) =>
                types.map((type: RendicontazioneDescriptorInterface)=>
                RendicontazioneFactory.create(type))
            )
        );
    }

    getRendicontazione(id_ram: string): Observable<Rendicontazione> {
        return this.API.Rendicontazione.get({id_ram})
            .pipe(
                map((subject: RendicontazioneDescriptorInterface) => RendicontazioneFactory.create(subject))
            );
    }

    updateRendicontazione(payload: any): Observable<Rendicontazione> {
        payload.ip = this.ipAddress;
    // console.log(payload)
        return this.API.Rendicontazione.update(payload)
            .pipe(
                map((subject: RendicontazioneDescriptorInterface) => RendicontazioneFactory.create(subject))
            );
    }
    ///////

    fetchTypeDocuments(payload?: any): Observable<TypeDocument[]>{
        return this.API.TypeDocument.fetch(payload)
        .pipe(
            map((types: TypeDocumentsDescriptorInterface[]) =>
                types.map((type: TypeDocumentsDescriptorInterface)=>
                TypeDocumentsFactory.create(type))
            )
        );
    }

    calcolaContributo(istanza, check, veicolo: Veicolo, type, allegatiVeicoli: Allegato[], veicoli:Veicolo[]){

       console.log(istanza, check,veicolo,type);
        var valoreContributo = 0;
        var magg_pmi = 0;
        var magg_rete = 0;
        var pmi = check.pmi;


        let tipoVeicolo = veicolo.type;
        //console.log(tipoVeicolo);
        //    console.log(allegatiVeicoli);
        let allegatiRottamazione = allegatiVeicoli.filter(x=> (x.typeDocument === '11' || x.typeDocument === '14') && x.adminState );
        //    console.log(allegatiRottamazione)
        const idVeicoloUnici = new Set();
        allegatiRottamazione.forEach(obj => idVeicoloUnici.add(obj.id_Veicolo));
        const numeroRichesteRottamazioneAccettate = idVeicoloUnici.size;
        //const numerorichiesteRottamazioneIstanza = ist


        //    console.log(idVeicoloUnici.size);
        if(tipoVeicolo.startsWith('rim_')){
            var campoRottamazione = 'rim_rott_'+ tipoVeicolo.slice(-1);
            //console.log(campoRottamazione)
        }


        var valore = type.typeVei.find(x=> x['campoDb']=== veicolo.type)['grantValue'];
        console.log(veicolo.id)
        console.log(check.dimImpresa,'check.dimImpresa')
        if(check.dimImpresa){
          //console.log('pmi okcheck')
            if(veicolo.type !== 'rim_nv_1' && veicolo.type !== 'rim_nv_2' && veicolo.type !== 'rim_nv_3'){
               // console.log('eccoci', check)
                valoreContributo = valore;
                if(check.pmi && check.pmi === 'accepted' && istanza['pmi'] === 'Yes' && check.dimImpresa !== 3) {
                    magg_pmi = valoreContributo * .10;
                }
                if(check.rete && check.rete === 'accepted'){
                    magg_rete = valoreContributo * .10;
                }

            }else{
              const numberType = parseInt(veicolo.type.match(/\d+$/)[0], 10);

              let numeroRimorchiRichiestaRottamazione = istanza['rim_rott_'+numberType];
                //  console.log('veicoli richiesta', numeroRimorchiRichiestaRottamazione);
              const idVeicoloArray = [
                ...new Set(allegatiVeicoli.filter(
                  (x)=> x.typeVei === veicolo.type 
                        && x.enable
                        && x.adminState === 'accepted' 
                        && (x.typeDocument === '11' || x.typeDocument === '14'

                   )).map(obj => obj.id_Veicolo))];
              var veicoliRottamati =0;

                //  console.log(idVeicoloArray)

              let checkRottamazione = idVeicoloArray.filter(
                (id_Veicolo) =>{
                  console.log(id_Veicolo)
                  let veicoloData = veicoli.find((x=> x.id === id_Veicolo && (x.adminState === 'accepted' || x.id === veicolo.id)));
                  let allegati = [... new Set(allegatiVeicoli.filter((x)=> x.id_Veicolo === id_Veicolo && x.enable && x.adminState === 'accepted' && (x.typeDocument === '11' || x.typeDocument === '14')).map(obj => obj.typeDocument))];
                   console.log(allegati)
                   console.log(veicoli)
                   console.log(veicoloData)
                  if(allegati.length === 2 && veicoloData !== undefined){
                    veicoliRottamati++
                    return true
                  }

                }
              )
              console.log(check)
                if(check.dimImpresa === 3){
                   valoreContributo = 3000;
                   console.log(checkRottamazione)
                        console.log(checkRottamazione.includes(veicolo.id))
                  if(checkRottamazione.includes(veicolo.id) && veicoliRottamati<istanza['rim_rott_'+parseInt(veicolo.type.match(/\d+$/)[0], 10)] ){
                    valoreContributo = 5000;
                  }

                }
                else if(check.dimImpresa === 2){
                    valoreContributo = veicolo.amount * .10;
                    if(valoreContributo > 5000){
                        valoreContributo = 5000;
                    }
                    if(checkRottamazione.includes(veicolo.id) || veicoliRottamati<istanza['rim_rott_'+parseInt(veicolo.type.match(/\d+$/)[0], 10)] ){
                        valoreContributo = 7000;
                    }
                }
                else if(check.dimImpresa === 1){
                  valoreContributo = veicolo.amount * .20
                    if(valoreContributo > 5000){
                        valoreContributo = 5000;
                    }
                    if(checkRottamazione.includes(veicolo.id) || veicoliRottamati<istanza['rim_rott_'+parseInt(veicolo.type.match(/\d+$/)[0], 10)] ){
                        valoreContributo = 7000;
                    }
                }
                if(check.rete && check.rete === 'accepted'){
                    magg_rete = valoreContributo * .10;
                }
            }
        }
        // console.log(istanza,tipoVeicolo,campoRottamazione)
        // console.log(istanza[tipoVeicolo] , istanza[campoRottamazione])
        // console.log(valoreContributo, magg_pmi, magg_rete)
        if(
          (istanza[tipoVeicolo]>0) &&
          istanza[campoRottamazione] > numeroRichesteRottamazioneAccettate  && allegatiRottamazione.length>0){

            valoreContributo = 7000
            if(check.dimImpresa === 3){
                valoreContributo = 5000
            }
        }


      //  console.log(valoreContributo, magg_pmi, magg_rete)

       return {valoreContributo, magg_pmi, magg_rete}
      //  return(valoreContributo)

    }

}
