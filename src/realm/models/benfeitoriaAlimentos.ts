export const BenfeitoriaAlimentosSchema = {
    name: 'BenfeitoriaAlimentos',
    primaryKey: 'benfeitoriaId',
    properties: {
        benfeitoriaId: 'int',
        alimentosIds: 'int[]', 
        }
}
