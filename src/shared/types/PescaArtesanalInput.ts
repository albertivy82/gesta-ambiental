import { conservacaoGelo } from "../../enums/ConservacaoGelo.enum";
import { PescariaCusteio } from "../../enums/PescariaCusteio.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface PescaArtesanalInput {
    
    freqPescaSemanal: number;
    horasPorDia: number;
    localDaPesca: string;
    horarioPrefencialPesca: string;
    descartePorPescaria: number;
    conservacaoPeixe: conservacaoGelo[]|null|''; 
    custeio: PescariaCusteio[]|null|'';
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
    conheceDefeso: SimNaoTalvez|null|''; 
    concordaDefeso: SimNaoTalvez|null|''; 
    recebeDefeso: SimNaoTalvez|null|''; 
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}