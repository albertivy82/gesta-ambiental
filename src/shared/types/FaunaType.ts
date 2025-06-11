import { SimNao } from "../../enums/simNao.enum";
import { TempoQueNaoAvistaEnum } from "../../enums/TempoQueNaoAvista.enum";

export interface FaunaType {
    id: number;
    especie: string;
    ondeOcorre: string;
    abundanciaAtual: string;
    abundanciaPassada: string;
    tempoQueNaoVe:string;
    usoDaEspecie: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
