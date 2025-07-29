export const ParticipacaoInstituicaoSchema = {
    name: 'ParticipacaoInstituicao',
    primaryKey: 'id',
    properties: {
        id: 'int',
        instituicao: 'string', 
        tipoDeRegistro: 'string',
        registro: 'string',
        morador: 'int', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
