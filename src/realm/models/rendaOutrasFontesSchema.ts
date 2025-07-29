export const RendaOutrasFontesSchema = {
    name: 'RendaOutrasFontes',
    primaryKey: 'id',
    properties: {
        id: 'int',
        fonte: 'string', 
        beneficiarios: 'int',
        rendaMesTotal: 'double', 
        benfeitoria: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
