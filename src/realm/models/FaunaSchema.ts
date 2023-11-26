export const FaunaSchema = {
    name: 'Fauna',
    primaryKey: 'id',
    properties: {
        id: 'int',
        especie: 'string',
        ocorreMata: 'string',
        ocorreRio: 'string',
        ocorreLago: 'string',
        ocorreRua: 'string',
        ocorreQuintal: 'string',
        outrasOcorrencias: 'string',
        frequenciaAtual: 'string',
        frequenciaPassada: 'string',
        tempoQueNaoVe: 'string',
        benfeitoria: 'int'
    }
}
