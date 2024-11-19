import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface PeixesInput {
    
    especie: string;
    locaisEspeciais: SimNaoTalvez |null|'';
    locaisEspecificosAlimentacao: SimNaoTalvez |null|'';
    usoAlimnetacao: SimNaoTalvez |null|'';
    usoComercio: SimNaoTalvez |null|'';
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
