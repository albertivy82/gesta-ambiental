import { Ocorrencia } from "../../enums/Ocorrencia.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";
import { TempoQueNaoAvistaEnum } from "../../enums/TempoQueNaoAvista.enum";

export interface FaunaType {
    id: number;
    especie: string;
    ocorreMata: SimNaoTalvez |null|'';
    ocorreRio: SimNaoTalvez |null|'';
    ocorreLago: SimNaoTalvez |null|'';
    ocorreRua: SimNaoTalvez |null|'';
    ocorreQuintal: SimNaoTalvez |null|'';
    outrasOcorrencias: SimNaoTalvez |null|'';
    frequenciaAtual: string;
    frequenciaPassada: Ocorrencia|null|'';
    tempoQueNaoVe: TempoQueNaoAvistaEnum|null|'';
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
