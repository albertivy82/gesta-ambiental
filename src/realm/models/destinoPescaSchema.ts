export const DestinoPescaSchema = {
    name: 'DestinoPesca',
    primaryKey: 'id',
    properties: {
        id: 'int',
        finalidade: 'string', 
        quantidade: 'double',
        destino: 'string', 
        destinoFixo: 'string', 
        paraQuantos: 'int',
        pescaArtesanal: 'int', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
