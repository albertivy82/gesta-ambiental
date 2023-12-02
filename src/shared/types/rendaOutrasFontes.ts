import { FontesRenda } from "../../enums/fontesRenda.enum";


export interface RendaOutrasFontesType {
    id: number;
    fonte: FontesRenda;
    beneficiarios: number;
    rendaMesTotal: number; 
    benfeitoria: { 
        id: number;
    }
}
