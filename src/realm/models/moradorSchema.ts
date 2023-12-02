export const MoradorSchema = {
    name: 'Morador',
    primaryKey: 'id',
    properties: {
        id: 'int',
        dataNascimento: 'date', 
        idade: 'int',
        perfil: 'string', 
        sexo: 'string', 
        estadoCivil: 'string', 
        escolaridade: 'string', 
        ondeEstuda: 'string?',
        trabalho: 'string', 
        religiao: 'string',
        benfeitoria: 'Benfeitoria'
    }
}
