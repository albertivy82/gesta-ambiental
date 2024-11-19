import { ServicoPublicos } from "../../enums/ServicoPublicos";

export interface ServicosBasicosType {
    id: number;
    tipoAtendimento: string; 
    servicosDeficitarios: ServicoPublicos; 
    localidade: {
        id: number;
    };
    sincronizado: boolean;
    idLocal?: string;
}
