export const ImovelSchema = {
    name: 'Imovel',
    primaryKey: 'id',
      properties: {
          id: 'int',
          rua: 'string?',
          numero: 'string?',
          bairro: 'string?',
          referencial: 'string',
          latitude: 'string',
          longitude:'string',
          situacaoFundiaria: 'string',
          documentacaoImovel: 'string',
          dataChegada: 'string',
          pretendeMudar: 'string',
          motivoVontadeMudanca: 'string?',
          relacaoArea: 'string',
          relacaoVizinhos:'string',
          limites:'string',
          transporte: 'string',
          linhasDeBarco: 'string',
          tipoSolo: 'string',
          esporteLazer:'string',   
          localidade:'int',
      }
};
