export const MamiferosSchema = {
    name: 'Mamiferos',
    primaryKey: 'id',
    properties: {
    id: 'int',
    especie: 'string',
    local: 'string',
    usoDaEspecie: 'string',
    problemasGerados: 'string',
    alimentacao:  'string',
    desricaoEspontanea: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
