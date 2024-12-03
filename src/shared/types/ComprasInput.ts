import { localComprasEnum } from "../../enums/localCompras.enum";

export interface ComprasInput {
    ondeFazCompras: localComprasEnum;
    detalheLocalDeCompras?: string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}