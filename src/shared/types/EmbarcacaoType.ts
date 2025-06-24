import { TipoCasco } from "../../enums/TipoCasco.enum";
import { TipoBarco } from "../../enums/tipoBarco.enum";

export interface EmbarcacaoType {
    id: number;
    numeracao: string;
    tipoBarco: TipoBarco|''|null;
    tipoCasco: TipoCasco|''|null;
    pescaArtesanal: {
        id:number;
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}