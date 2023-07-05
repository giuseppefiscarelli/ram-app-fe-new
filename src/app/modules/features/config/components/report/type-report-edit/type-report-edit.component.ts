import { ReportService } from './../../../report.service';
import { ConfigService } from './../../../config.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { typeReport } from '@app/app.costants';
import { TypeIstance } from '@app/modules/models/type-istance.model';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import htmlToPdfmake from 'html-to-pdfmake';
import { TypeReport } from '@app/modules/models/typeReport.model';
@Component({
  selector: 'app-type-report-edit',
  templateUrl: './type-report-edit.component.html',
  styleUrls: ['./type-report-edit.component.scss'],
  providers:[ConfigService]
})
export class TypeReportEditComponent implements OnInit {
  mode: string;
  dialogTitle: string;
  btnSubmit: string;
  form: FormGroup;
  formIntestazione: FormGroup;

  preview: any;
  htmlContent = '';

  typeIstance: TypeIstance[];
  record: TypeReport

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [

      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  ////////////////


  filterOptionsDescriptors: {
    [key: string]: any
    };













  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private reportService: ReportService,
  private configService: ConfigService,
  private dialogRef: MatDialogRef<TypeReportEditComponent>) {

    console.log(data)
    this.mode = data.mode;
    this.typeIstance = [];
    this.filterOptionsDescriptors = {
        type: [

        ],
        typeistance: [

        ]
    };

    this.configService.fetchTypeInstance({drop:true}).subscribe(
      (res) => {
        this.typeIstance = res;
        res.map(
          (x) => {
            this.filterOptionsDescriptors.typeistance.push(
              {
                title: x.description,
                value: x.id
              }
            )
          }
        )
      }
    )

    Object.keys(typeReport)
    .map((type: string) => (

        this.filterOptionsDescriptors.type.push(
            {
                title: typeReport[type],
                value: typeReport[type]
            }
        )
    ));


















    if(this.mode === 'create'){
      this.dialogTitle = 'Inserimento Tipo Report';
      this.btnSubmit= 'Salva';
      this.form = this.initializeForCreate();
      this.formIntestazione = this.initFormIntestazione();
     }

     if(this.mode === 'edit'){
      this.dialogTitle = 'Modifica Tipo Report';
      this.btnSubmit= 'Aggiorna';
      this.record = data.record
      this.form = this.initializeForEdit(data.record);
    //  this.formIntestazione = this.initFormIntestazione();
     }
  }

  ngOnInit() {
    //this.getPreview()
    if(this.mode === 'create'){
      this.form.controls.content.valueChanges.subscribe(
        (value) => {
          console.log(value)
        }
      )
    }
  }
  private initializeForCreate(): FormGroup {
    return new FormGroup({
        type: new FormControl(null, [Validators.required]),
        description: new FormControl(null,),
        detail: new FormControl(null),
        content: new FormControl(null),
        enable: new FormControl(null),
        typeistance: new FormControl(null,),
        object: new FormControl(null),

        })
  }
  private initializeForEdit(data:TypeReport): FormGroup {
    return new FormGroup({
          id: new FormControl(data.id),
        type: new FormControl(data.type, [Validators.required]),
        description: new FormControl(null,),
        detail: new FormControl(null),
        content: new FormControl(null),
        enable: new FormControl(null),
        typeistance: new FormControl(data.typeistance.id),
        object: new FormControl(null),

        })
  }
  initFormIntestazione(){
    return new FormGroup({
      logo: new FormControl(null, [Validators.required]),
      dimensions: new FormControl(120, [Validators.required]),
      marginTop: new FormControl(40, [Validators.required]),
      marginRight: new FormControl(20, [Validators.required]),
      marginBottom: new FormControl(40, [Validators.required]),
      marginLeft: new FormControl(40, [Validators.required]),

      subHeaderData: new FormControl(null, [Validators.required]),

      })
  }
  onSubmitBtn(mode){
    console.log(mode)
    Object
    .keys(this.form.controls)
    .map((key: string) => this.form.get(key))
    .forEach((control: AbstractControl) => {
        control.markAsDirty();
        control.markAsTouched();
    });
    if(this.form.valid){
        const payload = this.form.getRawValue();
//        this.dialogRef.close(payload)
        Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === null ) {
              delete payload[key];
          }
        });
          console.log(payload)

          if(this.mode ==='create'){
            this.configService.createTypeReport(payload).subscribe(
              (res) =>console.log(res)
            )
          }


    }

  }

  // async getPreview(){
  //   const content = this.form.controls.content.value
  //   const test = htmlToPdfmake(content)
  //   console.log(test)

  //   const subData = this.formIntestazione.controls.su

  //   const headerData = this.formIntestazione.getRawValue();
  //   const subHeaderData = [
  //         { text: 'Prot n° <%numeroProtocollo%>', fontSize: 10 },
  //         { text: 'Roma li, <%dataProtocollo%>', fontSize: 10 },
  //         {
  //           columns: [
  //             '',
  //             {
  //               stack: [
  //                 // second column consists of paragraphs
  //                 'Spett.Le',
  //                 '<%RagSociale%>',
  //                 '<%indirizzoAzienda%>',
  //                 '<%capCittaProvAzienda%>'
  //               ],
  //               fontSize: 12
  //             }
  //           ]
  //         },
  //         {text: 'Raccomandata via pec all\'indirizzo: <%pecImpresa%>', fontSize: 10}
  //       ];


  //     //  const subHeaderData = []
  //   let dataReport = {
  //     headerData,test,subHeaderData
  //   }
  //   console.log(headerData, dataReport)
  //  const data =  await this.reportService.generateReport(dataReport);
  //   data.getDataUrl((dataUrl) => {
  //     this.preview = dataUrl;
  //   })

  // }


  async testDoc(type){
    console.log(type)
    let dataReport = null
      const data =  await this.reportService.generateReport(type,dataReport);
    data.getDataUrl((dataUrl) => {
      this.preview = dataUrl;
    })
  }

  download(pdf){
    pdf.download('preview.pdf')
  }

}
