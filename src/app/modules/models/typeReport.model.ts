import { TypeIstance } from './type-istance.model';

import { User } from './user.model';
export class TypeReport{
    id:number;
    updatedAt: string;
    createdAt: string;
    description: string;
    enable:boolean;
    content: [];
    detail:[];
    typeistance: TypeIstance;
    type: string;
}
