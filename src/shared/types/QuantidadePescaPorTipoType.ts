import { TipoPescaArtesanal } from "../../enums/tipoPescaArtesanal.enum";

export interface QuantidadePescaPorTipoType {
    id: number;
    tipoPesca: TipoPescaArtesanal|''|null ; 
    quantidadePesca: number;
    pescaArtesanal: {
        id: number; 
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
