import { Injectable } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';///
import pdfFonts from "../../../../assets/custom-fonts";
import { HttpClient } from '@angular/common/http';
import { Observable, from, groupBy, map, mergeMap, reduce } from 'rxjs';
import { ApiService } from '@app/modules/network/api.service';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { Veicolo } from '@app/modules/models/veicolo.model';
import { Allegato } from '@app/modules/models/allegato.model';
import { Istanza } from '@app/modules/models/istanza.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable()
export class ReportService {

constructor(private http:HttpClient,  private API: ApiService,) { }



  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
    };

    img.onerror = error => {
        reject(error);
    };

    img.src = url;
    });
  }



   async generateReport(type,dataReport, veicoli?:Veicolo[], allegatiVeicoli?:Allegato[],typeIstance?: TypeIstance, istanza?:Istanza){
    console.log(dataReport);
    console.log(type)
    console.log(istanza)
//    return true
      console.log(pdfFonts.fonts)
    var header = [];
    let content = [];
    let footer ={};
    // if(dataReport){
    //   if(dataReport.headerData){
    //     let hd =dataReport.headerData
    //     console.log(hd)
    //     header.push({
    //       image:  await this.getBase64ImageFromURL(hd.logo ),
    //       width: hd.dimensions, margin: [
    //         hd.marginLeft,
    //         hd.marginTop,
    //         hd.marginRight,
    //         hd.marginBottom,

    //       ]
    //     })
    //   }

    //   if(dataReport.subHeaderData.length > 0){

    //     dataReport.subHeaderData.map(
    //       d=>  content.push(d)
    //     )

    //   }
    //   if(dataReport.test){
    //     dataReport.test.map(
    //       d=>  content.push(d)
    //     )
    //   }
    // }

    pdfMake.fonts = {
      'Arial' : {
        normal: 'ARIAL.TTF',
        bold: 'ARIALBD.TTF',
        italics: 'ARIALI.TTF',
        bolditalics: 'ARIALBI.TTF'
      },
      'Times' : {
        normal:'times.ttf',
        bold: 'timesbd.ttf',
        italics: 'timesi.ttf',
        bolditalics: 'timesbi.ttf'
      }
    }




    if(!dataReport){
      dataReport = {
        numProt: 'numero Protocollo da inserire',
        dataProt: 0,
        dataVerbale:0,
        ragSociale:'Ragione Sociale da inserire',
        indirizzo:'indirizzo imp',
        numCivico:'xx',
        cap:'-cap-',
        citta:'città impr',
        prov:'XX',
        pecImpresa:'pecimpresa@pec.it',
        idRam:'id RAM',
        dataIdRam:0,
        year:'anno',
        detail:[
          'Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato.',
          'Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato.'

        ],

        artAa:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },

        artAb:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artAc:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artAd:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artB1:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artB2:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artCa:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },

        artCb:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artCc:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        artD:{
          numero :0,
          importo:0,
          maggiorazioni:0,
          totale:0
        },
        totaleMaggiorazioni:0,
        totaleContributo:0,
        protPreavvisoRigetto:'ProtocolloPreavviso',
        dataPreavvisoRigetto:0,
        dataNotaInammissibilita:0,
        motivazioneInammissibilita:'motivazione'

      }
    }
    console.log(dataReport
      )


    if(type === 'integrazione'){
      let logo  = await this.getBase64ImageFromURL('../../../../assets/images/logo-ram-2024.png');
      let firma  = await this.getBase64ImageFromURL('../../../../assets/report/firma_fb.png');

      let listaRichieste =[];
      // let details = dataReport['detail'].map(x=> {
      //    x.margin = [0, 0, 0, 10]
      //   return x
      // })
      console.log( dataReport['detail'])
      let details = dataReport['detail'].map(
        (item) => {
          return { text: item, margin: [0, 0, 0, 5] };
        }
      )
      console.log(details)

       header= [
        {
          columns: [
            {
              width: 'auto',
              stack: [
                {
                  image: logo,
                  width: 150,
                  alignment: 'center'  // Posiziona l'immagine al centro
                },
                {
                  text: 'Direttore Operativo',
                  margin: [0, 10],  // Aggiungi margine superiore e inferiore per spaziare il testo
                  fontSize: 10,
                  alignment: 'center'  // Allinea il testo al centro
                }
              ],
              alignment: 'center',
              margin:[40,20]  // Allinea lo stack al centro del contenitore
            }
          ]
        }




       ]
      content.push(
        // {text: 'Prot n° '+dataReport['numProt'],margin: [ 0, 10, 0, 0 ]} ,
        // {text: 'Roma li '+dataReport['dataProt']},
        {text: 'Spett.Le',alignment:'left',margin: [ 250, 30, 0, 0 ]},
        {text: dataReport['ragSociale'],alignment:'left',margin: [ 250, 0, 0, 0 ]},
        {text: `${dataReport['indirizzo']}, ${dataReport['numCivico']}`,alignment:'left',margin: [ 250, 0, 0, 0 ]},
        {text: `${dataReport['cap']} - ${dataReport['citta']} ${dataReport['prov']}`,alignment:'left',margin: [ 250, 0, 0, 10 ]},
        { text:[ 'Raccomandata via pec all\'indirizzo: ', {text:dataReport['pecImpresa'], bold:true}], alignment:'left',margin: [ 0, 10 ]},
        {columns:[
          {text:'Oggetto: ',width: 'auto',bold:true},
          {text:'Contributi ai sensi del D.D. 7 aprile 2022 n.148 per le finalità di cui al D.M. 18 novembre 2021 n. 461 - "Incentivi agli investimenti nel settore dell\'autotrasporto Elevata Sostenibilità" ',margin: [ 5, 0, 0, 0 ], bold:true, alignment:'justify'},

        ],margin: [ 0, 5, 0, 5 ]},
        {
          text:[
           {text:'In qualità di soggetto attuatore, per conto del Ministero delle Infrastrutture e della Mobilità Sostenibili della gestione operativa del decreto in oggetto, Vi comunichiamo che a seguito di verifiche effettuate, per poter istruire la Vostra istanza '}
            ,
            {text: `prot. R.A.M. S.p.a. ES ${dataReport['idRam']}/${dataReport['year']}`, bold: true},
            { text: ' abbiamo necessità di ricevere i seguenti chiarimenti e/o documenti:'}
          ], alignment:'justify'
        },
        {ul:details, bold:true,alignment:'justify', style:'listStyle'},
          {
            text:[
              {text: 'Pertanto, ai sensi e per gli effetti dell\'art. 7, comma 4 del D.D 7 aprile 2022 n.148, Vi invitiamo a fornirci la suddetta documentazione '},
              {text:'entro e non oltre il termine perentorio di quindici giorni ', bold:true},
              {text:'decorrenti dalla data di ricezione della presente, accedendo al gestionale dedicato sul Portale, già utilizzato per la rendicontazione della domanda. Il Portale sarà abilitato alla modifica dei dati e, all\'interno della Sezione "Richieste integrazioni", al caricamento dei documenti contenenti le integrazioni richieste.'}
            ], alignment:'justify',  margin:[0,0]
          },

            {text:'Al fine di porre in condizione codesta spett.le impresa di rispettare pienamente quanto previsto dal decreto in oggetto specificato, si invita quest\'ultima a tenere presenti le seguenti inderogabili disposizioni:'},
            {
              ol:[
                'la documentazione inviata dovrà rispettare scrupolosamente i criteri di sostanza e di forma richiesti;',
                'decorso il termine perentorio suindicato, l\'istruttoria verrà conclusa sulla sola base della documentazione valida disponibile, senza che possa in alcun modo avviarsi qualsiasi, ulteriore fase di interlocuzione.'
              ], margin:[20,5], alignment:'justify'
             },

             {
              text:[
                {text:'Per qualsiasi informazione, potrete rivolgerVi al nostro Help Desk Incentivi \n'},
                {text: `(e-mail:`},
                {text: `incentivoinvestimenti@ramspa.it`, bold: true},
                {text: `)`, bold: true},

              ]
             },

             {text:' Cordiali saluti'}

            ,
              {
                image: firma,
                alignment:'right',
                width: 130, margin: [40,0, 0, 10]
              }




           )

      footer ={
        columns: [
            {text:'RAM Logistica Infrastrutture e Trasporti Spa \n Via Nomentana, 2 00161 Roma \n T +39 06 44124461 / F +39 06 44126168 \ninfo@ramspa.it - www.ramspa.it ', alignment: 'left',margin:[50,0,0,0], fontSize: 9, color:'#548cd4' },

            {text:'Azionista unico Ministero dell Economia e delle Finanze \nCapitale sociale € 1.000.000,00 \nIscritta al Registro delle Imprese di Roma \n P.Iva e C.F 07926631008 ', alignment: 'left',margin:[20,0,0,0], fontSize: 9, color:'#548cd4'},

          ]
      }

        var docDefinition = {
          pageSize: 'A4',
          defaultStyle: {
            font: 'Times'
          },
          pageMargins: [ 40,100, 40, 80 ],
          header: function(currentPage, pageCount) {
            if (currentPage === 1) {
              return header
            }},

          content: content,
          footer: (currentPage, pageCount) => {
            return footer
        },

         styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          listStyle: {
            margin: [0, 10]// Imposta l'altezza della linea a 2 volte l'altezza del carattere
        },

          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            fontSize: 13,
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
	}
        }
        const report = pdfMake.createPdf(docDefinition);

      return report

    }

    if(type === 'ammissione'){


      let veicoliAccettati = veicoli?.filter(x=> x.adminState === 'accepted')
      console.log(veicoli)
      console.log(typeIstance)

      console.log(veicoliAccettati)



      // veicoliAccettati.map((veicolo)=> {

      //   if()
      // } )

      // Converto l'array in un Observable
      const data$ = from(veicoli);

      // Converto l'array di nuovi dati in un oggetto con 'campoDb' come chiave
      const typeDataMap: { [key: string]: any } = typeIstance.typeVei.reduce((acc, item) => {
          acc[item['campoDb']] = item;
          return acc;
      }, {});

      // Raggruppo gli oggetti per l'attributo 'type' e calcolo la somma degli importi per ciascun gruppo
      const groupedData$: Observable<{ type: string; typeVei: string | null; artDm: string | null; totalAmount: number; numAccepted: number }[]> = data$.pipe(
          groupBy(obj => obj['type']), // Raggruppo gli oggetti per 'type'
          mergeMap(group => group.pipe(
              reduce((acc, val) => ({ totalAmount: acc.totalAmount + val['amount'], numAccepted: acc.numAccepted + (val['adminState'] === 'accepted' ? 1 : 0) }), { totalAmount: 0, numAccepted: 0 }), // Calcolo la somma degli importi e il numero di veicoli con adminState === 'accepted' per ciascun gruppo
              map(({ totalAmount, numAccepted }) => ({
                  type: group.key,
                  typeVei: typeDataMap[group.key] ? typeDataMap[group.key].campoDb : null,
                  artDm: typeDataMap[group.key] ? typeDataMap[group.key].artDm : null,
                  totalAmount,
                  numAccepted
              })) // Costruisco un oggetto con 'type', 'typeVei', 'artDm', la somma degli importi e il numero di veicoli con adminState === 'accepted'
          )),
          reduce((acc, val) => [...acc, val], []) // Raccolgo tutti gli oggetti risultanti in un array
      );

      // Osservo i risultati
      groupedData$.subscribe(result => console.log(result));
      let myGroupedData: { type: string; typeVei: string | null; totalAmount: number }[];
      // Osservo i risultati
      groupedData$.subscribe(result =>  myGroupedData = result);

      console.log(myGroupedData)

      // let art5a = {
      //   totalVeicoli: veicoli.filter(x=> x.adminState === 'accepted' && )
      // }













      let logo  = await this.getBase64ImageFromURL('../../../../assets/report/int_ammb.png');
      let firma  = await this.getBase64ImageFromURL('../../../../assets/report/firma_disanto.png');

      header= [{image: logo,width: 240, margin: [25,25]}]

      content.push(
      // {text: 'Prot n° '+dataReport['numProt'],margin: [0,25,0,0]} ,
      // {text: 'Roma li '+moment(Number(dataReport['dataProt'])).format('DD/MM/YYYY')},
      {text: 'Spett.Le',alignment:'left',margin: [ 250, 10, 0, 10 ]},
      {text: dataReport['ragSociale'],alignment:'left',margin: [ 250, 0, 0, 0 ]},
      {text: `${dataReport['indirizzo']}, ${dataReport['numCivico']}`,alignment:'left',margin: [ 250, 0, 0, 0 ]},
      {text: `${dataReport['cap']} - ${dataReport['citta']} ${dataReport['prov']}`,alignment:'left',margin: [ 250, 0, 0, 10 ]},
      {text:[ 'Raccomandata via pec all\'indirizzo: ', {text:dataReport['pecImpresa'], bold:true}], alignment:'left',margin: [ 0, 10 ]},
      {text:'Oggetto: Contributi ai sensi del D.D. 12 aprile 2022 n.155 per le finalità di cui al D.M. 18 novembre 2021 n. 459 - "Incentivi agli investimenti nel settore dell\'autotrasporto. " ', bold:true, margin: [ 0, 5, 0, 0 ], alignment:'justify'},
      {text:`Protocollo Istanza In ${dataReport['idRam']}/${dataReport['year']} Informativa ai sensi dell'art.10-bis legge 241/90`, bold:true, margin: [ 0, 0, 0, 5 ], alignment:'justify'},

      {text:'IL DIRETTORE GENERALE',alignment:'center',margin: [ 0,10 ], bold:true},
      {
        ul:[
          {text: `VISTA la domanda di ammissione al contributo di cui all'oggetto presentata da Codesta impresa e acquisista con protocollo n°${dataReport['idRam']}/${dataReport['year']} del ${moment(dataReport['dataIdRam']).format('DD/MM/YYYY')}`},
          {text:`VISTO il verbale di riunione della Commissione, istituita ai sensi dell'art. 12, comma 3, D.D. 12 aprile 2022 n.155 , tenutasi il giorno ${moment(Number(dataReport['dataVerbale'])).format('DD/MM/YYYY')}`}
        ],
        alignment:'justify'
      },
      {text:'fermo restando la permanenza dei requisiti di ammissibilità richiesti dalla normativa vigente, dispone per l\'istanza di finanziamento presenteta da Codesta impresa la relativa',
      alignment:'justify'},
      {text:'AMMISSIONE',alignment:'center',margin: [ 0,10 ], bold:true},
      {text:'per gli importi di seguito ripartiti secondo le categorie e sottocategorie di investimento di cui agli artt. 1 e 2 D.M. 18 novembre 2021 n. 459:', alignment:'justify'},
      {
        style: 'tableExample',
        table: {
          headerRows: 1,

          widths:['*',100,60,70,65,70],
          body:[
            [
              { text: 'Categoria Investimenti', bold:true, alignment:'center',margin:[0,10]},
              { text: 'Sotto-Categoria Investimenti', bold:true, alignment:'center'},
              { text: 'Numero acquisizioni finanziabili', bold:true, alignment:'center'},
              { text: 'Importo contributi ammessi (€)', bold:true, alignment:'center'},
              { text: 'Eventuali Maggiorazioni (%)', bold:true, alignment:'center'},
              { text: 'Importo Totale Contributo (€)', bold:true, alignment:'center'}
            ],

            [
              {rowSpan:4, text:'Art.5, comma 1, lett a)', alignment:'center',margin:[0,30]},
                {text:'Art.5, comma 1, lett a)', alignment:'left' },
                {text:dataReport['artAa']['numero']},
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAa']['importo'])},
                {text:istanza.pmi && istanza.pmi === 'Yes'?'10%':null},
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAa']['totale'])},


            ],
              [ '',
                {text:'Art.5, comma 1, lett b)', alignment:'left' },
                {text:dataReport['artAb']['numero']},
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAb']['importo'])},
                {text:istanza.pmi && istanza.pmi === 'Yes'?'10%':null},
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAb']['totale'])},
                ],
              [   '',
                {text:'Art.5, comma 2, lett c)', alignment:'left' },
                {text:dataReport['artAc']['numero']},
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAc']['importo'])},
                {text:istanza.pmi && istanza.pmi === 'Yes'?'10%':null},
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAc']['totale'])},

              ],
              // [   '',
              //   {text:'Art.3, comma 2, lett d)', alignment:'left' },
              //   {text:dataReport['artAd']['numero']},
              //   {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAd']['importo'])},
              //   {text:dataReport['artAd']['maggiorazione']},
              //   {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artAd']['totale'])},

              // ],
              [   '',
                {text:'Maggiorazione Rottamazione', colSpan:4, bold:true, alignment:'right'},
                '',
                '',
                '',
                {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['totaleMaggiorazioni'])},

              ],

            [
              {text:'Art.2, comma 1, lett b)', alignment:'center'},
              {text:'Art.5, comma 3', alignment:'left' },
              {text:dataReport['artB1']['numero']},
              {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artB1']['importo'])},
              {text:istanza.pmi && istanza.pmi === 'Yes'?'10%':null},
              {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artB1']['totale'])},



            ],
            [
              {text:'Art.2, comma 1, lett b)', alignment:'center'},
              {text:'Art.5, comma 4', alignment:'left' },
              {text:dataReport['artB2']['numero']},
              {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artB2']['importo'])},
              {text:istanza.pmi && istanza.pmi === 'Yes'?'10%':null},
              {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artB2']['totale'])},



            ],


            [
              {rowSpan:3, text:'Art.2, comma 1, lett c)', alignment:'center', margin:[0,15]},
              {text:'Art.5, comma 5, lett a)', alignment:'left' },
              {text:dataReport['artCa']['numero']},
              {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artCa']['importo'])},
              {text:istanza.pmi && istanza.pmi === 'Yes'?'10%':null},
              {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artCa']['totale'])},



            ],
            [ '',
            {text:'Art.5, comma 5, lett b)', alignment:'left' },
            {text:dataReport['artCb']['numero']},
            {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artCb']['importo'])},
            {text:dataReport['artCb']['maggiorazione']},
            {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artCb']['totale'])},

          ],
          [   '',
            {text:'Art.5, comma 5, lett c)', alignment:'left' },
            {text:dataReport['artCc']['numero']},
            {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artCc']['importo'])},
            {text:dataReport['artCc']['maggiorazione']},
            {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['artCc']['totale'])},

          ],

          [
            {text:'Totale Contributo(€)', colSpan:5, alignment:'right', bold:true},
            '',
            '',
            '',
            '',
            {text:new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(dataReport['totaleContributo'])},



          ],

          ],

        },

      },
      {
        alignment:'justify',
        pageBreak: 'before',
        text:'Si comunica altresì che, ai sensi dell’art. 3, comma 4, della legge 7 agosto 1990 n. 241, avverso il presente atto è ammesso ricorso giurisdizionale avanti al competente Tribunale Amministrativo Regionale oppure, in alternativa, ricorso straordinario al Presidente della Repubblica, rispettivamente entro sessanta e centoventi giorni dal ricevimento dello stesso'},


        {text:'AVVERTENZE:',bold:true},
        {text:[
          {text:'Si ricorda che a norma dell’'},
          {text:'Art. 2 comma 6 del DM 459/2021 i mezzi oggetti di contributo non possono essere alienati, concessi in locazione o in noleggio e devono rimanere nella piena disponibilità del beneficiario del contributo entro il triennio decorrente alla data di erogazione del contributo, pena la revoca del contributo erogato.',bold:true},
          {text:'Non si procede all\'erogazione del contributo anche nel caso di trasferimento della disponibilità dei beni oggetto degli incentivi nel periodo intercorrente fra la data di presentazione della domanda e la data di pagamento del beneficio.'}

        ], alignment:'justify'},
        {text:[
          {text:'Ai fini della liquidazione del contributo spettante, compatibilmente con la disponibilità di cassa e ad esito favorevole degli accertamenti di legge, dovrà pervenire '},
          {text:' - nel termine perentorio di 5 (cinque) giorni dal ricevimento della presente - l’eventuale nuovo IBAN (soltanto in caso di variazione rispetto a quello dichiarato in sede di istanza).',bold:true},

        ], alignment:'justify',margin: [0,10,0,0]},
        {text:[
          {text:'Soltanto in caso di contributo spettante di importo superiore ad euro 150.000,00',bold:true},
          {text:' – essendo necessario acquisire l’informazione antimafia ai sensi del decreto legislativo n. 159/2011 e successive ii e mm – dovrà essere allegata, entro 15 (quindici) giorni lavorativi dal ricevimento della presente:'},


        ], alignment:'justify',margin: [0,10,0,0]},
        {
          ul:[
            {text:'l’attestazione dell’iscrizione nella “white list”, prevista dalla legge n. 190/2012 e dal D.P.C.M. del 18 aprile 2013;'},
            {text:'oppure, in mancanza dell’iscrizione di cui sopra, dovrà essere trasmessa da codesta Impresa, la dichiarazione sostitutiva resa da ognuno dei soggetti di cui all’articolo 85 del decreto legislativo n. 159/2011, recante l’indicazione dei propri conviventi di maggiore età (con i dati anagrafici e i relativi codici fiscali degli stessi), corredata da copia di un documento di identità, in corso di validità, del sottoscrittore .'}
          ],
          margin:[10,5],
          alignment:'justify'
        },
        {text:[
          {text:'L’eventuale documentazione di cui sopra dovrà essere trasmessa in '},
          {text:'un unico file PDF (comprensivo del documento di identità del legale rappresentante dell’impresa)',bold:true},
          {text:', tramite posta elettronica certificata all’indirizzo '},
          {text:'dg.ssa@pec.mit.gov.it',bold:true},


        ], alignment:'justify',margin: [0,10,0,0]},
        {text:[
          {text:'Per qualsiasi informazione, è a disposizione il servizio Help Desk Incentivi (e-mail:'},
          {text:'incentivoinvestimenti@ramspa.it',bold:true},
          {text:')'},



        ], alignment:'justify',margin: [0,10,0,0]},
        {
          image: firma,
          alignment:'right',
          width: 140, margin: [40,0, 0, 10]
        }

      )

      var docDefinitionb = {
        pageSize: 'A4',
        defaultStyle: {
          font: 'Times'
        },
        pageMargins: [ 25,100, 30, 80 ],
        header: function(currentPage, pageCount) {
          if (currentPage === 1) {
            return header
          }},
        content: content,
        footer: (currentPage, pageCount) => {
          return footer
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            fontSize: 10,
            alignment:'right'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        }
      }

      const report = pdfMake.createPdf(docDefinitionb);

      return report


    }

    if(type === 'rigetto'){
      let logo  = await this.getBase64ImageFromURL('../../../../assets/report/int_ammb.png');
      let firma  = await this.getBase64ImageFromURL('../../../../assets/report/firma_disanto.png');
      header= [{image: logo,width: 240, margin: [40,20, 0, 0]}];

       content.push(
       // {text: 'Prot n° '+dataReport['numProt'], margin: [0,25, 0, 0]} ,
       // {text: 'Roma li '+moment(Number(dataReport['dataProt'])).format('DD/MM/YYYY')},
        {text: 'Spett.Le',alignment:'left',margin: [ 250, 10, 0, 10 ]},
        {text: dataReport['ragSociale'],alignment:'left',margin: [ 250, 0, 0, 0 ]},
        {text: `${dataReport['indirizzo']}, ${dataReport['numCivico']}`,alignment:'left',margin: [ 250, 0, 0, 0 ]},
        {text: `${dataReport['cap']} - ${dataReport['citta']} ${dataReport['prov']}`,alignment:'left',margin: [ 250, 0, 0, 10 ]},
        { text:[ 'Raccomandata via pec all\'indirizzo: ', {text:dataReport['pecImpresa'], bold:true}], alignment:'left',margin: [ 0, 10 ]},
        {text:'Oggetto: Contributi ai sensi del D.D. 7 aprile 2022 n.148 per le finalità di cui al D.M. 18 novembre 2021 n. 461 - "Incentivi agli investimenti nel settore dell\'autotrasporto Elevata Sostenibilità" ', bold:true, margin: [ 0, 5, 0, 5 ], alignment:'justify'},
        {text:`Protocollo Istanza In ${dataReport['idRam']}/${dataReport['year']} Informativa ai sensi dell'art.10-bis legge 241/90`, bold:true, margin: [ 0, 5, 0, 5 ], alignment:'justify'},
        {alignment:'justify',text:`In riferimento alla domanda di ammissione agli incentivi di cui al D.M. 18 novembre 2021 n. 459 acquisita in data ${moment(dataReport['dataIdRam']).format('DD/MM/YYYY')} con prot. n. ${dataReport['idRam']}/${dataReport['year']} si comunica che, sulla base delle risultanze dell'istruttoria effettuata dalla società RAM S.p.A e della valutazione di questa Commissione, l'istanza di ammissione al finanziamento degli investimenti di cui all'art. 1 del 18 novembre 2021 n.459, destinato alle imprese di autotrasporti merci, è risultata`},
        {text:'INAMMISSIBILE',alignment:'center',margin: [ 0,10 ], bold:true},
        {text:'Per la/le seguente/i motivazione/i:'},
        {
          ul:dataReport['detail'], bold:true,margin:[0,10],alignment:'justify',
        },
        {
          text:[
            {text:'Si comunica che, ai sensi dell\'art. 10-bis, comma 1, della legge n. 241/1990, l\'impresa in indirizzo ha tempo 10 giorni dalla ricezione della presente per produrre per iscritto le proprie eventuali osservazioni, corredate se del caso, da idonea documentazione che ',margin:[0,10]},
            {bold:true, decoration: 'underline' ,text:'dovrà essere inviata alla RAM S.p.A., esclusivamente presso il seguente indirizzo di posta elettronica certificata: ram.investimenti2022@legalmail.it'},

          ],alignment:'justify'
        },

        {
            stack: [

              {
                text: 'Il PresidenteLa presidente della commissione',
                margin: [0, 5],  // Aggiungi margine superiore e inferiore per spaziare il testo

                alignment: 'center'  // Allinea il testo al centro
              },
              {
                text: '(Ing. Donatella Orlandi)',
                margin: [0, 5],  // Aggiungi margine superiore e inferiore per spaziare il testo

                alignment: 'center'  // Allinea il testo al centro
              }
            ],
            alignment: 'left',  // Allinea lo stack al centro del contenitore,


            margin:[200,20,20,0],

              width: 'auto',



        }

       )

       console.log(content)

    var docDefinitionc = {
      pageSize: 'A4',
      defaultStyle: {
        font: 'Times'
      },
      pageMargins: [ 40,100, 40, 80 ],
      header: function(currentPage, pageCount) {
        if (currentPage === 1) {
          return header
        }},

      content: content,
      footer: (currentPage, pageCount) => {
        return footer
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 10,
          alignment:'right'
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }

    const report = pdfMake.createPdf(docDefinitionc);

  return report
    }

    if(type === 'inammissibilita'){
      let logo  = await this.getBase64ImageFromURL('../../../../assets/report/int_ammb.png');
      let firma  = await this.getBase64ImageFromURL('../../../../assets/report/firma_resp.png');


      header= [{image: logo,width: 240, margin: [20,20, 0, 0]}];

      content.push(
        {text: 'Prot n° '+dataReport['numProt'],margin: [ 0, 25, 0, 0 ]} ,
        {text: 'Roma li '+moment(Number(dataReport['dataProt'])).format('DD/MM/YYYY')},
        {text: 'Spett.Le',alignment:'right',margin: [ 0, 0, 0, 0 ]},
        {text: dataReport['ragSociale'],alignment:'right',margin: [ 0, 0, 0, 0 ]},
        {text: `${dataReport['indirizzo']}, ${dataReport['numCivico']}`,alignment:'right',margin: [ 0, 0, 0, 0 ]},
        {text: `${dataReport['cap']} - ${dataReport['citta']} ${dataReport['prov']}`,alignment:'right',margin: [ 0, 0, 0, 0 ]},
        { text:[ 'Raccomandata via pec all\'indirizzo: ', {text:dataReport['pecImpresa'], bold:true}],margin: [ 0, 10 ]},
        {text:'Oggetto: Contributi ai sensi del D.D. 12 aprile 2022 n.155 per le finalità di cui al D.M. 18 novembre 2021 n. 459 - "Incentivi agli investimenti nel settore dell\'autotrasporto" ', bold:true, margin: [ 0, 5, 0, 5 ], alignment:'justify'},
        {text:'IL DIRETTORE GENERALE',alignment:'center',margin: [ 0,10 ], bold:true},
        {
          ul:[
            {text: `VISTA la domanda di ammissione al contributo di cui all'oggeto presentata da Codesta impresa e acquisista con protocollo n°${dataReport['idRam']}/${dataReport['year']} del ${moment(Number(dataReport['dataIdRam'])).format('DD/MM/YYYY')}`},
            {text:`VISTO il verbale di riunione della Commissione, istituita ai sensi dell'art. 12, comma 3, D.D. 12 aprile 2022 n.155 , tenutasi il giorno ${moment(Number(dataReport['dataVerbale'])).format('DD/MM/YYYY')}`},
            {text:`VISTA la nota prot. n. In/${dataReport['protPreavvisoRigetto']} del${moment(Number(dataReport['dataPreavvisoRigetto'])).format('DD/MM/YYYY')} con la quale è stato dat preavviso di regetto della suddetta istanza di finanziamento;`},
            {text:`CONSIDERATO che non è pervenuta alcuna risposta alla predetta nota del ${moment(Number(dataReport['notaInammissibilita'])).format('DD/MM/YYYY')}`},
            {text:'CONSIDERATO che premane la seguente motivazione di inammissibilità:'}

          ],
          margin:[10,0],

          alignment:'justify'
        },
        {text:dataReport['motivazioneInammissibilita'], margin:[10,0,0,0]},
        {text:'COMUNICA',alignment:'center',margin: [ 0,10 ], bold:true},
        {text:'a Codesta impresa che il procedimanto amministartivo avviato con l\'istanza di ammissione al contributo si è concluso con il', alignment:'justify'},
        {text:'RIGETTO DELLA DOMANDA',alignment:'center',margin: [ 0,10 ], bold:true},
        {text:'Si comunica altresì che, ai sensi dell\'art. 3, comma 4, della legge 7 agosto 1990 n. 241, avverso il presente atto è ammesso ricorso giurisdizionale avantio al competente Tribunale Amministrativo Regionale oppure, in alternativa, ricorso straordinario al Presidente della Republica, rispettivamente entro sessanta e centoventi giorni dal ricevimento dello stesso.', alignment:'justify'},
        {
          image: firma,
          alignment:'right',
          width: 100, margin: [40,0, 0, 10]
        }




      )

      var docDefinitiond = {
        pageSize: 'A4',
        defaultStyle: {
          font: 'Times'
        },
        pageMargins: [ 25,100, 30, 80 ],
        header: function(currentPage, pageCount) {
          if (currentPage === 1) {
            return header
          }},

        content: content,
        footer: (currentPage, pageCount) => {
          return footer
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            fontSize: 10,
            alignment:'right'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        }
      }

      const report = pdfMake.createPdf(docDefinitiond);

      return report

    }










    // const url = await report.getDataUrl((dataUrl) => {
    //   console.log(dataUrl)
    //   return dataUrl
    // })
   // console.log('url',url)
  //  console.log(report)
   // return url
  }

  uploadAllegatoFile(payload): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', payload, payload.filename);
    return this.API.Upload.create(formData)
    .pipe(
        map((response: any) => response)
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



}
