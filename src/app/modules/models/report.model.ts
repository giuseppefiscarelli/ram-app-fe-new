import { User } from './user.model';
export class Report{
    id:number;
    updatedAt: string;
    createdAt: string;
    id_ram: number;
    prot_ram: string;
    userCreate: number | User;
    dataCreate: string;
    userConversion: number | User;
    dataConversion: string;
    dataSend: string;
    userSend: number | User;
    filenameUpload:  string;
    filenameStorage:  string;
    fd: [];
    status:  string;
    typeReport:number;
    enable:boolean;
    detail:[];
}
