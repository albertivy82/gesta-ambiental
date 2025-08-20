
export interface BenfeitoriaInput {
    
    tipoBenfeitoria: string;
    funcao: string;
    afastamentoDaPrincipal: string;
    impermeabilizacaoSolo: string;
    limites: string;
    areaBenfeitoria: number;
    pavimentos: number;
    paredes: string;
    tipoCobertura: string;
    tipoEsquadrias: string;
    origemMadeiraDaConstrucao: string;
    origemPedraDaConstrucao: string;
    origemAreiaDaConstrucao: string;
    alagamentos: string;
    epocaOcorrencia: string;
    efluentes: string;
    residuos: string;
    fonteEnergia: string;
    energiaAlimentos: string;
    meiosLocomocao: string;
    informativoPredominante: string;
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
