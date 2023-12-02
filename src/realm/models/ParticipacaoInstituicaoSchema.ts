export const ParticipacaoInstituicaoSchema = {
    name: 'ParticipacaoInstituicao',
    primaryKey: 'id',
    properties: {
        id: 'int',
        instituicao: 'string', 
        tipoDeRegistro: 'string',
        Registro: 'string',
        morador: 'Morador' 
    }
}
