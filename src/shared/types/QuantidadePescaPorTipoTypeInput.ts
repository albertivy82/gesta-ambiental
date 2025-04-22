import { TipoPescaArtesanal } from "../../enums/tipoPescaArtesanal.enum";

export interface QuantidadePescaPorTipoInput
 {
    id: number;
    quantidadePesca: number;
    tipoPesca: TipoPescaArtesanal ; 
    pescaArtesanal: {
        id: number; 
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
