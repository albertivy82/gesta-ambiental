export const CreditoSchema = {
    name: 'Credito',
    primaryKey: 'id',
    properties: {
        id: 'int',
        nome: 'string',
        valor: 'double', 
        benfeitoria: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
