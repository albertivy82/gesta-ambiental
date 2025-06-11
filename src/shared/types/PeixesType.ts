import { SimNao } from "../../enums/simNao.enum";

export interface PeixesType {
    id: number;
    especie: string;
    climaOcorrencia: string;
    locaisEspecificosReprodução: string;
    locaisEspecificosAlimentacao: string;
    maisImportanteDaRegiao: SimNao |null|'';
    usosDaEspécie: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
