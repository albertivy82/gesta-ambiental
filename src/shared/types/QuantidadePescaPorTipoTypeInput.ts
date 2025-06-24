import { TipoPescaArtesanal } from "../../enums/tipoPescaArtesanal.enum";

export interface QuantidadePescaPorTipoInput
 {
    tipoPesca: TipoPescaArtesanal|''|null ; 
    quantidadePesca: number;
    pescaArtesanal: {
        id: number; 
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
