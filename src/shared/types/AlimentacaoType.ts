import { alimento} from "../../enums/Alimento.enum";

export interface AlimentacaoType {
    id: number;
    alimentacaoPrincipal: alimento;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
