import { localComprasEnum } from "../../enums/localCompras.enum";

export interface ComprasType {
    id: number;
    ondeFazCompras: localComprasEnum;
    detalheLocalDeCompras?: string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
