import { DestinoPesca } from "../../enums/DestinoPesca.enum";
import { FinalidadePesca } from "../../enums/FinalidadePesca.enum";
import { SimNao } from "../../enums/simNao.enum";



export interface DestinoPescaInput {
    
    finalidadePesca: FinalidadePesca; 
    quantidade: number;
    destino: DestinoPesca; 
    destinoFixo: SimNao; 
    paraQuantos: number;
    pescaArtesanal: {
        id: number; 
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}