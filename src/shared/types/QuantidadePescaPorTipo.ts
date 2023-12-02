import { TipoPescaArtesanal } from "../../enums/tipoPescaArtesanal.enum";

export interface QuantidadePescaPorTipoType {
    id: number;
    quantidadePesca: number;
    tipoPesca: TipoPescaArtesanal ; 
    pescaArtesanal: {
        id: number; 
    }
}
