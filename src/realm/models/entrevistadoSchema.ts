export const EntrevistadoSchema = {
    name: 'Entrevistado',
    primaryKey: 'id',
      properties: {
        id: 'int',
          nome: 'string?',
          apelido: 'string?',
          naturalidade: 'string?',
          conheceUcProposta: 'string?',
          propostaMelhorarArea: 'string?',
          imovel: 'int?', 
          sincronizado: 'bool?',
          idLocal: 'string?',
          idFather: 'string?' 
  }
};