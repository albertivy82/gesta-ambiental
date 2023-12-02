export const PescaArtesanalSchema = {
    name: 'PescaArtesanal',
    primaryKey: 'id',
    properties: {
        id: 'int',
        freqPescaSemanal: 'int',
        horasPorDia: 'double',
        localDaPesca: 'string',
        horarioPrefencialPesca: 'string',
        descartePorPescaria: 'float',
        conservacaoPeixe: 'string[]', 
        custeio: 'string[]', 
        geloPorPescaria: 'double',
        custoGeloPorPescaria: 'double',
        composicaoRancho: 'string',
        custoRanchoPorViagem: 'double',
        combustivelPorViagem: 'double',
        custoCombustivelPorViagem: 'double',
        localDesembarque: 'string',
        conservacaoTipo: 'string', 
        destinopesca: 'int[]', 
        pescaPorSafra: 'double',
        localPescaSafra: 'string',
        localDeReproducaoPeixe: 'string',
        periodoDefeso: 'string',
        conheceDefeso: 'string', 
        concordaDefeso: 'string', 
        recebeDefeso: 'string', 
        quantidadePescaPorTipo: 'int[]', 
        embarcacao: 'int[]', 
        especies: 'int[]', 
        benfeitoria: 'int' 
    }
}
