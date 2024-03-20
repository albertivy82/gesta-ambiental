import { Funcao } from "../../enums/Funcao.enum";
import { TipoBenfeitoria } from "../../enums/TipoBenfeitoria.enum";

export interface BenfeitoriaType {
    id?: number;
    tipoBenfeitoria: TipoBenfeitoria|""| null;
    funcao: Funcao | "" | null;
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
    imovel?: {
        id:number;
    }
    idLocalImovel?: string;
    sincronizado: boolean;
    idLocal?: string;
    
}
