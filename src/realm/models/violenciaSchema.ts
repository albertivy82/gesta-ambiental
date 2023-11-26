export const ViolenciaSchema = {
    name: 'Violencia',
    primaryKey: 'id',
    properties: {
        id: 'int',
        tipo: 'string',
        condicao: 'string',
        ocorrencias: 'int',
        destaqueDoMorador: 'string',
        benfeitoria: 'int'
    }
}
