export const VegetacaoSchema = {
    name: 'Vegetacao',
    primaryKey: 'id',
    properties: {
        id: 'int',
        usoMedicinal: 'string',
        usoAlimentacao: 'string',
        usoOrnamental: 'string',
        usoComercial: 'string',
        usaFlor: 'string',
        usaFolha: 'string',
        usaSemente: 'string',
        usaFruto: 'string',
        usaCasca: 'string',
        usaRaiz: 'string',
        usoLeiteLatex: 'string',
        outrosUsos: 'string',
        coletaLocalPublico: 'string',
        coletaCultivo: 'string',
        coletaCompra: 'string',
        coletaAmbienteEspecifica: 'string',
        quemEnsinouUso: 'string',
        repassaConhecimento: 'string',
        observacoesEspontaneas: 'string',
        benfeitoria: 'int'
    }
}
