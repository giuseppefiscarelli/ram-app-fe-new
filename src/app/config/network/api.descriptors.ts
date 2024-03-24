// Entities

export interface UserDescriptorInterface {
  id: string;
  email: string;
  role: string;
  businessName: string;
  vatNumber:string;
  note:string;
  createdAt: string;
  rnablePec:boolean;
}
export interface MenuDescriptorInterface{

        id?:string;
        label: string;
        icon?:string;
        target?: string;
        children?:MenuDescriptorInterface[]


}
export interface AllegatoDescriptorInterface{
  id:number;
  updatedAt: string;
  createdAt: string;
  id_ram: number;
  id_Veicolo: number;
  id_Report: number;
  typeVei: string;
  typeDocument: string;
  filenameUpload: string;
  filenameStorage: string;
  jsonData:[];
  note:string;
  enable: boolean;
  userUpload: string;
  dataUpload: string;
  adminState:string;
  adminNote: string;
  adminDate: string;
  adminUser: number;
  fd:[];
  targa:string;
}
export interface FileDescriptorInterface {
  id: string;
  fd: string;
  filename: string;
  refId: string;
  refType: string;
  type: string;
  typeFile: string;
  note: string;
}

export interface IstanzeDescriptorInterface{
  id: number;
  id_ram: number;
  nome: string;
  cognome: string;
  luogo_nascita: string;
  prov_nascita: string;
  data_nascita: string;
  comune_residenza: string;
  prov_residenza:string;
  indirizzo_residenza: string;
  civico_residenza: string;
  cap_residenza: string;
  email_richiedente: string;
  tipo_dichiarante: string;
  ragione_sociale: string;
  comune_impr: string;
  prov_impr: string;
  indirizzo_impr: string;
  civico_impr: string;
  cap_impr: string;
  pref_tel_impr: string;
  num_tel_impr: string;
  email_impr: string;
  piva: string;
  cf: string;
  tipo_impresa: string;
  pec_impr: string;
  codice_albo: string;
  codice_ren: string;
  cciaa_prov: string;
  cciaa_codice: string;
  cciaa_data: string;
  codice_ateco: string;
  banca_istituto: string;
  banca_agenzia: string;
  iban_it: string;
  iban_num_chk: string;
  iban_cin: string;
  iban_abi: string;
  iban_cab: string;
  iban_cc: string;
  nv1: number;
  sp1: number;
  rott1: number;
  nv2: number;
  sp2: number;
  rott2: number;
  nv3: number;
  sp3: number;
  rott3: number;
  nv4: number;
  sp4: number;
  rott4: number;
  nv5: number;
  sp5: number;
  rott5: number;
  nv6: number;
  sp6: number;
  rott6: number;
  nv7: number;
  sp7: number;
  rott7: number;
  nv8: number;
  sp8: number;
  rott8: number;
  nv9: number;
  sp9: number;
  rott9: number;
  nv10: number;
  sp10: number;
  rott10: number;
  nv11: number;
  sp11: number;
  r_nv_1: number;
  r_sp_1: number;
  r_rott_1: number;
  r_nv_2: number;
  r_sp_2: number;
  r_rott_2: number;
  r_nv_3: number;
  r_sp_3: number;
  r_rott_3: number;
  rim_nv_1: number;
  rim_sp_1: number;
  rim_rott_1: number;
  rim_nv_2: number;
  rim_sp_2: number;
  rim_rott_2: number;
  rim_nv_3: number;
  rim_sp_3: number;
  pmi: string;
  rete: string;
  data_istanza: string;
  note: string;
  caricamento: string;
  pec_msg_identificativo: string;
  pec_msg_id: string;
  eliminata: string;
  user:string;
  data_agg:string;
  tipo_istanza: number;

  data_invio:string;
}
export interface IstanzaCheckDescriptorInterface {
  id: number;
  id_ram:  number;
  dimImpresa:  number;
  noteDimImpresa: string;
  rete: string;
  pmi:string;
  pec: string;
  notePec:  string;
  firma: string;
  noteFirma:  string;
  doc: string;
  noteDoc:  string;
  contratto: string;
  noteContratto:  string;
  delega: string;
  noteDelega:  string;
  totContributo: string;
  createdAt: number;
  updatedAt: number;
}

export interface RendicontazioneDescriptorInterface{
  id:number;
  id_ram: number;
  enable: boolean;
  userEnable: string;
  status: string;
  dateDisable: string;
  userDisable: string;
  dateStart: string;
  dateEnd: string;
  canceled: boolean;
  dateCanceled: string;
  userCanceled: string;
  noteCanceled: string;

}

export interface ReportDerscriptorInterface{
  id:number;
  updatedAt: string;
  createdAt: string;
  userCreate:UserDescriptorInterface;
  userInvio:UserDescriptorInterface;
  dataInvio:string;
  userUpload:UserDescriptorInterface;
  dataUpload:string;
  statusInvio:string;
  enable: boolean;
  status: string;
  typeReport: string;
  numProt: number ;
  dataProt: string;
  dataVerbale: string;
  ragSociale: string;
  indirizzo: string;
  numCivico: string;
  cap: string;
  citta: string;
  prov: string;
  pecImpresa: string;
  idRam: number ;
  idAllegato: number;
  dataIdRam: string;
  year: string;
  detail: any[];
  artAa: any;
  artAb: any;
  artAc: any;
  artAd: any;
  artB1: any;
  artB2: any;
  artCa: any;
  artCb: any;
  artCc: any;
  artD: any;
  totaleMaggiorazioni: number ;
  totaleContributo: number ;
  protPreavvisoRigetto: string ;
  dataPreavvisoRigetto: string ;
  dataNotaInammissibilita: string ;
  motivazioneInammissibilita: string;
  body: string;
  subject: string;
}

export interface MailConfigDescriptorInterface{
  id:number;
  updatedAt: string;
  createdAt: string;
  user: string;
  host: string;
  port: number;
  password: string;
}


export interface TypeDocumentsDescriptorInterface {
  id: number;
  description: string;
  required: boolean;
  upload: boolean;
  adminControl: boolean;
  adminNote: boolean;
  fields: {
      type: string;
      description: string;
      required: boolean;
  }[];
}
export interface TypeDocumentsDescriptorInterface {
  id: number;
  description: string;
  required: boolean;
  upload: boolean;
  adminControl: boolean;
  adminNote: boolean;
  fields: {
      type: string;
      description: string;
      required: boolean;
  }[];
}
export interface TypeIstanceDescriptorInterface {
  id:number;
  year: string;
  description: string;

  reportingEndDate: string;
  reportingStartDate: string;
  sendEndDate: string;
  sendStartDate: string;
  typeVei:[];
  categoryVei:[];
  certAttach:[];

}
export interface TypesReportDescriptorInterface{

  id:number;
  updatedAt: string;
  createdAt: string;
  description: string;
  enable:boolean;
  content: [];
  detail:[];
  typeistance: TypeIstanceDescriptorInterface;
  type: string;
}
export interface VeicoloDescriptorInterface{
  id:number;
  createdAt: number;
  updatedAt: number;
  userIns: string;
  acquisitionType: string;
  amount: number;
  brand: string;
  category: string;
  id_ram: string;
  licensePlate: string;
  model: string;
  type: string;
  adminState: string;
  adminUser: string;
  adminDateUpdate: string;
  adminNote: string;
  costoIstr: number;
  valoreContributo: number;
  pmiIstr: number;
  reteIstr: number;
  noteIstr: string;

}

export interface EmployeeDescriptorInterface{
  id: number;
  idUser:number;
  surname: string;
  name: string;
  company:number;
  enabled: boolean;
  note:  string;
}
export interface CompaniesDescriptorInterface {
  id: number;
  description: string;
}


export interface DesksDescriptorInterface{

    id: number;
    idUser: number;
    name: string;
    code: string;
    phase: string;
    nameEng: string;

}
export interface ProjectsDescriptorInterface{
  id:number;
  company:number;
  type: string;
  category:  string;
  internalCode: string;
  description: string;
  idCustomer:  string;
  status: string;
  idSupervisor:number;
  datePlanStart: string;
  datePlanEnd:  string;
  dateStart:  string;
  dateEnd:  string;
  dateDelivery: string;
  workingMinutes:number;
  intervalMinutes:number;
  attachData:[];
}
export interface StampingEventsDescriptorInterface{
  id: number;
    idDip: number;
    desDip: string;
    start: string;
    end: string;
    ordinary:  number;
    absence: number;
    surplus:  number;
    type:string;
    day:  number;
    month:  number;
    year: number;
    note:string;
    other: any[];
    just: any[];
    idTask: number;
    idProject: number;
    status: boolean;
}

export interface TasksDescriptorInterface{
  id:number;
  idProject: number;
  description:  string;
  datePlanStart: string;
  datePlanEnd: string;
  dateStart: string;
  dateEnd: string;
  option: [];
  typeOperations:[];
  status:  string;
  quantity: number;
  operators:[];
  idDesk: number;
  checkList:[];
  interval:{
    start?:number;
    end?:number;
    totalMin?: number
    problemcheck?:string;
    note?: string;
  }[];
  workingDeskMinutes:number;
  workingOperatorsMinutes:number;
  note: string;
}

export interface FitokDatasDescriptorInterface{
  id: number;
  fitok: string;
  dateStartProduction:  number;
  dateEndProduction:  number;
  dateDelivery:  number;
  sellingPrice: number;
  ddt:  string;
  type:  string;
  material:  string;
  length: number;
  width: number;
  height: number;
  assembly:  string;
  tare: number;
  net: number;
  gross: number;
  quantity: number;
  firCm: number;
  plywoodCm: number;
  osbCm: number;
  totalCm: number;
}

// Responses
export interface SigninResponseInterface {
    auth: AuthDescriptorInterface;
    user: UserDescriptorInterface;
}

export interface AuthDescriptorInterface {
    tokenType: string;
    expiresIn: string;
    accessToken: string;
}




