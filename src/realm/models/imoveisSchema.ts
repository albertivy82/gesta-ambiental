export const ImovelSchema = {
    name: 'Imovel',
    primaryKey: 'id',
      properties: {
          id: 'int',
          rua: 'string',
          numero: 'string',
          bairro: 'string',
          referencial: 'string',
          latitude: 'string',
          longitude:'string',
          dataChegada: 'string',
          pretendeMudar: 'string',
          motivoVontadeMudanca: 'string',
          relacaoComArea: 'string',
          relacaoComVizinhos:'string',
          limitesTerreno:'string',
          meioTranporteDominante: 'string',
          linhasDeBarco: 'string',
          tipoSolo: 'string',
          eporteLazer:'string',   
          localidade: {
              id:'number'
          }
      }
};
