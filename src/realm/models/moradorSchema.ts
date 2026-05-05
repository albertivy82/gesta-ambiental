export const MoradorSchema = {
    name: 'Morador',
    primaryKey: 'id',
    properties: {
        id: 'int',
        perfil: 'string', 
        idade: 'int',
        sexo: 'string', 
        escolaridade: 'string', 
        estadoCivil: 'string', 
        ondeEstuda: 'string?',
        trabalho: 'string', 
        religiao: 'string',
        doencas: 'string',
        benfeitoria: 'int?',
        sincronizado: 'bool',
        idLocal: 'string?',
        idFather: 'string?'
    }
}
