export const BenfeitoriaSchema = {
    name: 'Benfeitoria',
    primaryKey: 'id',
    properties: {
      id: 'int',
      tipoBenfeitoria: 'string',
      funcao: 'string',
      afastamentoDaPrincipal: 'string?',
      impermeabilizacaoSolo: 'string',
      limites: 'string?',
      areaBenfeitoria: 'double',
      pavimentos: 'int',
      paredes: 'string',
      tipoCobertura: 'string',
      tipoEsquadrias: 'string',
      origemMadeiraDaConstrucao: 'string',
      origemPedraDaConstrucao: 'string',
      origemAreiaDaConstrucao: 'string',
      alagamentos: 'string',
      epocaOcorrencia: 'string',
      efluentes: 'string',
      residuos: 'string',
      fonteEnergia: 'string',
      energiaAlimentos: 'string',
      meiosLocomocao: 'string',
      informativoPredominante: 'string',
      imovel: 'int?',
      sincronizado: 'bool?',
      idLocal: 'string?',
      idFather: 'string?'
    }
  };
  