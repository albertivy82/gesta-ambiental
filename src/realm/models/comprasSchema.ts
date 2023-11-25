export const ComprasSchema = {
    name: 'Consumo',
    
    primaryKey: 'id',
    properties: {
        id: 'int',
        ondeFazCompras: 'string',
        detalheLocalDeCompras: 'string?',
        benfeitoria: 'int' 
    }
}