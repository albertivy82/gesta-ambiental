
export interface BenfeitoriaType {
    id?: number;
    tipoBenfeitoria: string;
    funcao: string;
    tipoSolo: string;
    areaBenfeitoria: number;
    pavimentos: number;
    tipoConstrucao: string;
    OrigemMaterialConstrucao: string[]; 
    tipoCobertura: string;
    tipoEsquadrias: string;
    alagamentos: string;
    nivelAlagamentos: string;
    efluentes: string;
    residuos: string;
    fonteEnergia: string;
    energiaAlimentos: string;
    informativoPredominante: string;
    importanciaDeProtegerFauna: string;
    importanciaDeProtegerAmbiente: string;
    qualEspacoPrecisaSerPreservado: string;
    problemasRelacionadosAoAmbiente: string;
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
