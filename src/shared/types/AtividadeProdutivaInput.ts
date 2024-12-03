import { AtividadesProdutivas } from "../../enums/AtividadesProdutivas.enum";

export interface AtividadeProdutivaInput {
    
    atividade: AtividadesProdutivas|null|'';
    pessoasEnvolvidas: number;
    faturamentoAtividadeMesTotal: number; 
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;

}
