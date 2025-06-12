import { SimNao } from "../../enums/simNao.enum";

export interface PeixesInput {
    
    especie: string;
    climaOcorrencia: string;
    locaisEspecificosReproducao: string;
    locaisEspecificosAlimentacao: string;
    maisImportanteDaRegiao: string;
    usosDaEspecie: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
