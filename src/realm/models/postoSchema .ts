export const PostoSchema = {
    name: 'Posto',
    primaryKey: 'id',
    properties: {
      id: 'int',
      nome: 'string',
      ambulatorial: 'string',
      urgenciaEmergencia: 'string',
      medicosPorTurno: 'int',
      localidade: 'int',
      sincronizado: 'bool',
      idLocal: 'string?',
 }
};