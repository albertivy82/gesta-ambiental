export const CreditoSchema = {
    name: 'Credito',
    primaryKey: 'id',
    properties: {
        id: 'int',
        nome: 'string',
        valor: 'string', 
        benfeitoria: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
