export const PeixesSchema = {
    name: 'Peixes',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        locaisEspeciais: 'string',
        locaisEspecificosAlimentacao: 'string',
        usoAlimnetacao: 'string',
        usoComercio: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
