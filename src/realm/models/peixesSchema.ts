export const PeixesSchema = {
    name: 'Peixes',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        climaOcorrencia: 'string',
        locaisEspecificosReprodução: 'string',
        locaisEspecificosAlimentacao: 'string',
        maisImportanteDaRegiao: 'string',
        usosDaEspécie: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
