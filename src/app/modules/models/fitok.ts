export class Fitok{
  PhasesEvents:[
    {
      phaseStartDate:Number;
      phaseEndDate:Number;
      operator:string;
      desk:string;
      pause:[{
        start?:Number;
        end?:Number;
        problemcheck?:boolean;
      }],
      totalTime:Number;
      fitok:string;
    }
  ]
}

