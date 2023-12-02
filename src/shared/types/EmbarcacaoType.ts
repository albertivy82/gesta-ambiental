import { TipoCasco } from "../../enums/TipoCasco.enum";
import { TipoBarco } from "../../enums/tipoBarco.enum";

export interface EmbarcacaoType {
    id: number;
    tipoBarco: TipoBarco;
    tipoCasco: TipoCasco;
    pescaArtesanal: {
        id:number;
    }
}