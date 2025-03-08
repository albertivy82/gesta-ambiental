import { SimNao } from "../../enums/simNao.enum";
import { TempoQueNaoAvistaEnum } from "../../enums/TempoQueNaoAvista.enum";

export interface FaunaType {
    id: number;
    especie: string;
    ocorreMata: SimNao |null|'';
    ocorreRio: SimNao |null|'';
    ocorreLago: SimNao |null|'';
    ocorreRua: SimNao |null|'';
    ocorreQuintal: SimNao |null|'';
    outrasOcorrencias: SimNao |null|'';
    frequenciaAtual: string;
    frequenciaPassada: string|'';
    tempoQueNaoVe: TempoQueNaoAvistaEnum|null|'';
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
