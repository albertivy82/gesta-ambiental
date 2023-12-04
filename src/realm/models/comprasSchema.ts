export const ComprasSchema = {
    name: 'Compras',
    
    primaryKey: 'id',
    properties: {
        id: 'int',
        ondeFazCompras: 'string',
        detalheLocalDeCompras: 'string?',
        benfeitoria: 'int' 
    }
}