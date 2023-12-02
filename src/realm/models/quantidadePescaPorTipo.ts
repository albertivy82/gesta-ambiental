export const QuantidadePescaPorTipoSchema = {
    name: 'QuantidadePescaPorTipo',
    primaryKey: 'id',
    properties: {
        id: 'int',
        quantidadePesca: 'double',
        tipoPesca: 'string',
        pescaArtesanal: 'int' 
}
}