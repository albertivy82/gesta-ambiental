import { SimNao } from "../../enums/simNao.enum";


export interface PescaArtesanalType {
    id: number;
    freqPescaSemanal: number;
    horasPorDia: number;
    localDaPesca: string;
    horarioPrefencialPesca: string;
    descartePorPescaria: number;
    conservacaoPeixe: string; 
    custeio: string;
    geloPorPescaria: number;
    custoGeloPorPescaria: number;
    composicaoRancho: string;
    custoRanchoPorViagem: number;
    combustivelPorViagem: number;
    custoCombustivelPorViagem: number;
    localDesembarque: string;
    pescaPorSafra: number;
    localPescaSafra: string;
    localDeReproducaoPeixe: string;
    periodoDefeso: string;
    conheceDefeso: SimNao|null|''; 
    concordaDefeso: SimNao|null|''; 
    recebeDefeso: SimNao|null|''; 
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
