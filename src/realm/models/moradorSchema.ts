export const MoradorSchema = {
    name: 'Morador',
    primaryKey: 'id',
    properties: {
        id: 'int',
        perfil: 'string', 
        dataNascimento: 'date',
        sexo: 'string', 
        escolaridade: 'string', 
        estadoCivil: 'string', 
        ondeEstuda: 'string?',
        trabalho: 'string', 
        religiao: 'string',
        benfeitoria: 'Benfeitoria'
    }
}
