export const RepteisSchema = {
    name: 'Repteis',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        local: 'string',
        desova: 'string',
        localDesova: 'string',
        periodoDesova: 'string',
        usoDaEspecie: 'string',
        ameacaParaEspecie: 'string',
        problemasGerados: 'string',
        descricaoEspontanea: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
