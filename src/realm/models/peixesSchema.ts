export const PeixesSchema = {
    name: 'Peixes',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        climaOcorrencia: 'string',
        locaisEspecificosReproducao: 'string',
        locaisEspecificosAlimentacao: 'string',
        maisImportanteDaRegiao: 'string',
        usosDaEspecie: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
