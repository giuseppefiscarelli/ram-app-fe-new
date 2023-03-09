export class TypeDocument {
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
