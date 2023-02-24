// Entities
export interface UserDescriptorInterface {
    id: string;
    role: string;
    name: string;
    surname: string;
    email: string;
    createdAt: string;
    enable: boolean;
    type: string;
    company: number;
    environment: {
        type: string, role: string
    }[];
    menu:MenuDescriptorInterface[];
}
export interface MenuDescriptorInterface{

        id?:string;
        label: string;
        icon?:string;
        target?: string;
        children?:MenuDescriptorInterface[]


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




