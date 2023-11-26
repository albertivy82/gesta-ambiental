export interface FaunaType {
    id: number;
    especie: string;
    ocorreMata: string;
    ocorreRio: string;
    ocorreLago: string;
    ocorreRua: string;
    ocorreQuintal: string;
    outrasOcorrencias: string;
    frequenciaAtual: string;
    frequenciaPassada: string;
    tempoQueNaoVe: string;
    benfeitoria: {
        id:number;
    } 
}
