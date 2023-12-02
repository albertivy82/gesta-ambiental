import { AtividadesProdutivas } from "../../enums/AtividadesProdutivas.enum";

export interface AtividadeProdutivaType {
    id: number;
    atividade: AtividadesProdutivas;
    pessoasEnvolvidas: number;
    faturamentoAtividadeMesTotal: number; 
    benfeitoria: {
        id: number;
    }; 

}
