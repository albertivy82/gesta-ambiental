import { Servico } from "../../enums/Servico.enum";

export interface OutrosServicosType {
    id: number;
    outrosServicos: Servico| "" | null;
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}