import { Servico } from "../../enums/Servico.enum";

export interface OutrosServicosInput {
    
    outrosServicos: Servico| "" | null;
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}