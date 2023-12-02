export const EmbarcacaoSchema = {
    name: 'Embarcacao',
    primaryKey: 'id',
    properties: {
        id: 'int',
        numeracao: 'string',
        tipoBarco: 'string', 
        tipoCasco: 'string', 
        pescaArtesanal: 'int' 
    }
}