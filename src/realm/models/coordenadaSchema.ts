export const CoordenadaSchema = {
    name: 'Coordenada',
    primaryKey: 'id',
    properties: {
      id: 'int',
      latitude: 'string?',
      longitude: 'string?',
      localidade: 'int' 
 }
};