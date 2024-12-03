import { ServicoPublicos } from "../../enums/ServicoPublicos";

export interface ServicosBasicosType {
    id: number;
    tipoAtendimento: string; 
    servicosDeficitarios: ServicoPublicos; 
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
