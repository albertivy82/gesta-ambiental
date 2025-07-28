
export interface AtividadeProdutivaType {
    id: number;
    atividade: string;
    pessoasEnvolvidas: number;
    faturamentoAtividadeMesTotal: string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;

}
