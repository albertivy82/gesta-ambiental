import { DestinacaoPesca } from "../../enums/destinacaoPesca.enum";
import { simNao } from "../../enums/simNaoTalvez.enum";


export interface DestinoPescaType {
    id: number;
    destinacao: DestinacaoPesca; 
    quantidade: number;
    destino: DestinoPescaType; 
    destinoFixo: simNao; 
    paraQuantos: number;
    pescaArtesanal: {
        id: number; 
    }
}