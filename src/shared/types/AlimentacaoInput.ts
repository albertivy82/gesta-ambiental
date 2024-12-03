import { alimento} from "../../enums/Alimento.enum";

export interface AlimentacaoInput {
    
    alimentacaoPrincipal: alimento;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
