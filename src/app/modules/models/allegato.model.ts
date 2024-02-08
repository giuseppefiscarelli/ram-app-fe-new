export class Allegato{
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
    fd:[]
}
