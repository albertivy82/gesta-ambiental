import { SimNao } from "../../enums/simNao.enum";

export interface PeixesType {
    id: number;
    especie: string;
    locaisEspeciais: SimNao |null|'';
    locaisEspecificosAlimentacao: SimNao |null|'';
    usoAlimnetacao: SimNao |null|'';
    usoComercio: SimNao |null|'';
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
