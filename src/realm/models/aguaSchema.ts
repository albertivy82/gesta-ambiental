export const AguaSchema = {
    name: 'Agua',
    primaryKey: 'id',
    properties: {
        id: 'int',
        tipoDeFornecimento: 'string',
        qualidadeDaAgua: 'string',
        metodoTratamento: 'string',
        corDagua: 'string',
        cheiroDagua: 'string',
        saborDagua: 'string',
        profundidadePoco: 'float?',
        benfeitoria: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
