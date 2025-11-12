import { User } from "./user.model";

export class Report {
  id:number;
  createdAt:string;
  updatedAt:string;
  userCreate:User;
  userInvio:User;
  dataInvio:string;
  userUpload:User;
  dataUpload:string;
  statusInvio:string;
  enable: boolean;
  status: string;
  typeReport: string;
  numProt: number | null;
  dataProt: string | null;
  dataVerbale: string | null;
  dataVerbaleDeduzioni: string | null;
  ragSociale: string;
  indirizzo: string;
  numCivico: string;
  cap: string;
  citta: string;
  prov: string;
  pecImpresa: string;
  idRam: number | null;
  idAllegato: number | null;
  dataIdRam: string | null;
  year: string;
  detail: any[];
  artAa: ArtDetails;
  artAb: ArtDetails;
  artAc: ArtDetails;
  artAd: ArtDetails;
  artB1: ArtDetails;
  artB2: ArtDetails;
  artCa: ArtDetails;
  artCb: ArtDetails;
  artCc: ArtDetails;
  artD: ArtDetails;
  totaleMaggiorazioni: number | null;
  totaleContributo: number | null;
  protPreavvisoRigetto: string | null;
  dataPreavvisoRigetto: string | null;
  dataNotaInammissibilita: string | null;
  motivazioneInammissibilita: string | null;
  fd:[];
  body: string;
  subject: string;

}

export class ArtDetails {
  numero: number | null;
  importo: number | null;
  maggiorazioni: number | null;
  totale: number | null;
}
