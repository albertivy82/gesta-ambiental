export const BenfeitoriaSchema = {
    name: 'Benfeitoria',
    
    primaryKey: 'id',
    properties: {
        id: 'int',
        tipoBenfeitoria: 'string', 
        funcao: 'string', 
        tipoSolo: 'string', 
        areaBenfeitoria: 'double',
        paviementos: 'int',
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
        importanciaDeProtegerAmibiente: 'string',
        qualEspacoPrecisaSerPreservado: 'string',
        probelmasRelacionadosAoAmbiente: 'string',
        imovel: 'int' 
    }
};
