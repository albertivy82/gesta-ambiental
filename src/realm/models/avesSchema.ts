export const AvesSchema = {
    name: 'Aves',
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
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
