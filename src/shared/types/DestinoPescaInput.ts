import { DestinoPesca } from "../../enums/DestinoPesca.enum";
import { FinalidadePesca } from "../../enums/FinalidadePesca.enum";
import { SimNao } from "../../enums/simNao.enum";



export interface DestinoPescaInput {
    
    finalidade: FinalidadePesca| "" | null; 
    quantidade: number;
    destino: DestinoPesca| "" | null; 
    destinoFixo: SimNao| "" | null; 
    paraQuantos: number;
    pescaArtesanal: {
        id: number; 
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}