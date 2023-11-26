export const AguaSchema = {
    name: 'Agua',
    primaryKey: 'id',
    properties: {
        id: 'int',
        possuiForneceimentoPublico: 'string',
        qualidadeFornecimentoPublico: 'string',
        corAguaForncimentoPublico: 'string',
        saborAguaFornecimentoPublico: 'string',
        cheiroAguaFornecimentoPublico: 'string',
        poco: 'string',
        profundidadePoco: 'double',
        corAguaPoco: 'string',
        saborAguaPoco: 'string',
        cheiroAguaPoco: 'string',
        tratamentoAgua: 'string',
        benfeitoria: 'int'
    }
}
