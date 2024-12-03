import { ServicoPublicos } from "../../enums/ServicoPublicos";

export interface ServicosBasicosInput {
    
    tipoAtendimento: string; 
    servicosDeficitarios: ServicoPublicos|""| null; 
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
