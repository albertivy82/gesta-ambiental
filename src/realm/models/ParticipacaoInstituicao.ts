export const ParticipacaoInstituicaoSchema = {
    name: 'ParticipacaoInstituicao',
    primaryKey: 'id',
    properties: {
        id: 'int',
        instituicao: 'string',
        tipoDeRgistro: 'string',
        Registro: 'string',
        morador: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
