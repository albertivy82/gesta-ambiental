export const FaunaSchema = {
    name: 'Fauna',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        ondeOcorre: 'string',
        abundanciaAtual: 'string',
        abundanciaPassada: 'string',
        tempoQueNaoVe: 'string',
        usoDaEspecie: 'string',
        entrevistado: 'int?', 
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
