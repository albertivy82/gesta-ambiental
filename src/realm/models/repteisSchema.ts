export const RepteisSchema = {
    name: 'Repteis',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        local: 'string',
        periodo: 'string',
        uso: 'string',
        ameacado: 'string',
        problemasRelacionados: 'string',
        cacado: 'string',
        descricaoEspontanea: 'string',
        benfeitoria: 'int'
    }
}
