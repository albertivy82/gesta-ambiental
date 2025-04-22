export const EspecieSchema = {
    name: 'Especie',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        quantidadePescada: 'double',
        quantidadeDaPesca: 'string', 
        tamanhoDaPesca: 'string', 
        exploracaoNivel: 'string', 
        precoVendaMedioKg: 'double',
        importancia: 'string',
        mesesMaiorOcorrencia: 'string',
        pescaArtesanal: 'int', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?' 
    }
}
