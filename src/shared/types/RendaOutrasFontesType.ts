import { FontesRenda } from "../../enums/fontesRenda.enum";


export interface RendaOutrasFontesType {
    id: number;
    fonte: FontesRenda|null|'';
    beneficiarios: number;
    rendaMesTotal: string; 
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
