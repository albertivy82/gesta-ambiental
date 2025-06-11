export const AvesSchema = {
    name: 'Aves',
    primaryKey: 'id',
    properties: {
    id: 'int',
    especie: 'string',
    climaOcorrencia: 'string',
    usosDaEspécie: 'string',
    localDeAglomeracao: 'string',
    problemasGerados: 'string',
    ameacaSofrida: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
