import { ReportService } from './../../../report.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import htmlToPdfmake from 'html-to-pdfmake';
@Component({
  selector: 'app-type-report-edit',
  templateUrl: './type-report-edit.component.html',
  styleUrls: ['./type-report-edit.component.scss']
})
export class TypeReportEditComponent implements OnInit {
  mode: string;
  dialogTitle: string;
  btnSubmit: string;
  form: FormGroup;
  formIntestazione: FormGroup;

  preview: any;
  htmlContent = '';

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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private reportService: ReportService,
  private dialogRef: MatDialogRef<TypeReportEditComponent>) {

    console.log(data)
    this.mode = data.mode
    if(this.mode === 'create'){
      this.dialogTitle = 'Inserimento Tipo Report';
      this.btnSubmit= 'Salva';
      this.form = this.initializeForCreate();
      this.formIntestazione = this.initFormIntestazione();
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
        description: new FormControl(null, [Validators.required]),
        detail: new FormControl(null, [Validators.required]),
        content: new FormControl(null, [Validators.required]),
        enable: new FormControl(null, [Validators.required]),
        typeinstance: new FormControl(null, [Validators.required]),
        object: new FormControl(null, [Validators.required]),

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


    }

  }

  async getPreview(){
    const content = this.form.controls.content.value
    const test = htmlToPdfmake(content)
    console.log(test)

    const subData = this.formIntestazione.controls.su

    const headerData = this.formIntestazione.getRawValue();
    const subHeaderData = [
          { text: 'Prot n° <%numeroProtocollo%>', fontSize: 10 },
          { text: 'Roma li, <%dataProtocollo%>', fontSize: 10 },
          {
            columns: [
              '',
              {
                stack: [
                  // second column consists of paragraphs
                  'Spett.Le',
                  '<%RagSociale%>',
                  '<%indirizzoAzienda%>',
                  '<%capCittaProvAzienda%>'
                ],
                fontSize: 12
              }
            ]
          },
          {text: 'Raccomandata via pec all\'indirizzo: <%pecImpresa%>', fontSize: 10}
        ];


      //  const subHeaderData = []
    let dataReport = {
      headerData,test,subHeaderData
    }
    console.log(headerData, dataReport)
   const data =  await this.reportService.generateReport(dataReport);
    data.getDataUrl((dataUrl) => {
      this.preview = dataUrl;
    })

  }

}
