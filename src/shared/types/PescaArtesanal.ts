import { conservacaoGelo } from "../../enums/ConservacaoGelo.enum";
import { PescariaCusteio } from "../../enums/PescariaCusteio.enum";
import { simNao } from "../../enums/simNaoTalvez.enum";

export interface PescaArtesanalType {
    id: number;
    freqPescaSemanal: number;
    horasPorDia: number;
    localDaPesca: string;
    horarioPrefencialPesca: string;
    descartePorPescaria: number;
    conservacaoPeixe: conservacaoGelo[]; 
    custeio: PescariaCusteio[];
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
    conheceDefeso: simNao; 
    concordaDefeso: simNao; 
    recebeDefeso: simNao; 
    benfeitoria: {
        id:number;
    } 
}
