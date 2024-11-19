import { Operadora } from "../../enums/Operadora.enum";
import { servicoComunicacaoEnum } from "../../enums/servicoComunicacao.enum";

export interface ServicosComunicacaoInput {
    
    tipoServicoComunicacao: servicoComunicacaoEnum |null|'';
    operadoraServicoComunicacao: Operadora | null |'';
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}