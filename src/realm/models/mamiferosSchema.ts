export const MamiferosSchema = {
    name: 'Mamiferos',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        usoConsumo: 'string',
        usoComercio: 'string',
        usoCriacao: 'string',
        usoRemedio: 'string',
        usoOutros: 'string',
        priblemasRelacionados: 'string',
        alimentacao: 'string',
        desricaoEspontanea: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
