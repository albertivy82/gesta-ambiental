export const RendaOutrasFontesSchema = {
    name: 'RendaOutrasFontes',
    primaryKey: 'id',
    properties: {
        id: 'int',
        fonte: 'string', 
        beneficiarios: 'int',
        rendaMesTotal: 'string', 
        benfeitoria: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
