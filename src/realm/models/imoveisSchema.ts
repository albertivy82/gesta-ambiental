export const ImovelSchema = {
    name: 'Imovel',
    primaryKey: 'id',
    properties: {
        id: 'int',
        rua: 'string?',
        numero: 'string?',
        bairro: 'string?',
        referencial: 'string?',
        latitude: 'string?',
        longitude: 'string?',
        areaImovel: 'double?',
        tipoSolo: 'string?', 
        vizinhosConfinantes: 'string?',
        situacaoFundiaria: 'string?', 
        documentacaoImovel: 'string?', 
        limites: 'string?',
        linhasDeBarco: 'string?',
        pavimentacao: 'string?',
        iluminacaoPublica: 'string?',
        equipamentosUrbanos: 'string?',
        espacosEsporteLazer: 'string?', 
        programaInfraSaneamento: 'string?',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
};
