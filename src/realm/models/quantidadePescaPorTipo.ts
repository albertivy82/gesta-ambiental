export const QuantidadePescaPorTipoSchema = {
    name: 'QuantidadePescaPorTipo',
    primaryKey: 'id',
    properties: {
        id: 'int',
        tipoPesca: 'string',
        quantidadePesca: 'double',
        pescaArtesanal: 'int', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
}
}