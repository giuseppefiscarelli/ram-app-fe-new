

export class Task {
  id:number;
  idProject: number;
  description:  string;
  datePlanStart: string;
  datePlanEnd: string;
  dateStart: string;
  dateEnd: string;
  option: [];
  status:  string;
  quantity: number;
  operators:[];
  typeOperations:[];
  idDesk: number;
  checkList:any[];
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
