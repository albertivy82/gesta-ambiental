
export interface AtividadeProdutivaType {
    id: number;
    atividade: string;
    pessoasEnvolvidas: number;
    faturamentoAtividadeMesTotal: number;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;

}
