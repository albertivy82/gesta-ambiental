export const ServicosComunicacaoSchema ={
    name: 'ServicosComunicacao',
    primaryKey: 'id',
    properties: {
        id: 'int',
        tipoServicoComunicacao: 'string',
        operadoraServicoComunicacao: 'string',
        benfeitoria: 'int' 
    }
}