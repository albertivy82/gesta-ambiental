import { FontesRenda } from "../../enums/fontesRenda.enum";


export interface RendaOutrasFontesType {
    id: number;
    fonte: FontesRenda|null|'';
    beneficiarios: number;
    rendaMesTotal: number; 
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
