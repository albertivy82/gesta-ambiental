export const EscolaSchema = {
    name: 'Escola',
    primaryKey: 'id',
    properties: {
      id: 'int',
      nome: 'string',
      iniciativa: 'string',
      merenda: 'string',
      transporte: 'string',
      educacaoAmbiental: 'string',
      localidade:'int',
      sincronizado: 'bool',
      idLocal: 'string?',
 }
};