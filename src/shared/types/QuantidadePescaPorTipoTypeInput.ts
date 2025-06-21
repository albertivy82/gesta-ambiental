import { TipoPescaArtesanal } from "../../enums/tipoPescaArtesanal.enum";

export interface QuantidadePescaPorTipoInput
 {
    
    quantidadePesca: number;
    tipoPesca: TipoPescaArtesanal ; 
    pescaArtesanal: {
        id: number; 
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
