export const BenfeitoriaSchema = {
    name: 'Benfeitoria',
    
    primaryKey: 'id',
    properties: {
        id: 'int',
        tipoBenfeitoria: 'string', 
        funcao: 'string', 
        tipoSolo: 'string', 
        areaBenfeitoria: 'double',
        pavimentos: 'int',
        tipoConstrucao: 'string', 
        OrigemMaterialConstrucao: 'string[]', 
        tipoCobertura: 'string', 
        tipoEsquadrias: 'string', 
        alagamentos: 'string', 
        nivelAlagamentos: 'string', 
        efluentes: 'string', 
        residuos: 'string', 
        fonteEnergia: 'string', 
        energiaAlimentos: 'string', 
        informativoPredominante: 'string', 
        importanciaDeProtegerFauna: 'string',
        importanciaDeProtegerAmbiente: 'string',
        qualEspacoPrecisaSerPreservado: 'string',
        problemasRelacionadosAoAmbiente: 'string',
        imovel: 'int' 
    }
};
