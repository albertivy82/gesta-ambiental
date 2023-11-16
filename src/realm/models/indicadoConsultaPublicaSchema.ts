export const IndicadoConsultaPublicaSchema = {
    name: 'IndicadoConsultaPublica',
    primaryKey: 'id',
    properties: {
        id: 'int',
        nome: 'string',
        perfil: 'string', 
        telefone: 'string',
        entrevistado: 'int' 
    }
};
