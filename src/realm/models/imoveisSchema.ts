export const ImovelSchema = {
    name: 'Imovel',
    primaryKey: 'idLocal',
    properties: {
        idLocal: 'string',
        id: 'int?',
        rua: 'string?',
        numero: 'string?',
        bairro: 'string?',
        referencial: 'string?',
        latitude: 'string?',
        longitude: 'string?',
        areaImovel: 'double?',
        vizinhos: 'string?', 
        situacaoFundiaria: 'string?', 
        documentacaoImovel: 'string?', 
        dataChegada: 'string?',
        pretendeMudar: 'string?', 
        motivoVontadeMudanca: 'string?',
        relacaoArea: 'string?',
        relacaoVizinhos: 'string?',
        limites: 'string?', 
        iluminacaoPublica: 'string?', 
        transporte: 'string?', 
        programaInfraSaneamento: 'string?',
        linhasDeBarco: 'string?',
        tipoSolo: 'string?', 
        esporteLazer: 'string?', 
        localidade: 'int',
        sincronizado: 'bool',
        
    }
};

