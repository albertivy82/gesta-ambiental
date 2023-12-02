export const AtividadeProdutivaSchema = {
    name: 'AtividadeProdutiva',
    primaryKey: 'id',
    properties: {
        id: 'int',
        atividade: 'string', 
        pessoasEnvolvidas: 'int',
        faturamentoAtividadeMesTotal: 'double', 
        benfeitoria: 'Benfeitoria' 
    }
}
