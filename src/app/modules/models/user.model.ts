import { UserRole } from "../../app.costants";


export class User {
    id: number;
    email: string;
    name: string;
    surname: string;
    fullname: string;
    createdAt: string;
    role: UserRole;
    enable: boolean;
    type: string;
    company: number;
    environment: {
        type: 'string', role: 'string'
    }[];
    menu:Menu;

    constructor() {

    }

    defineExtraProperties(): void {
        this.fullname = `${this.name} ${this.surname}`;
    }
}

export class Menu {
    id?:string;
    label: string;
    icon?:string;
    target?: string;
    children?:Menu[]
}
