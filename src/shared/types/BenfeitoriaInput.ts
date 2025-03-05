import { Funcao } from "../../enums/Funcao.enum";
import { origemMaterialConstrucao } from "../../enums/OrigemMaterialConstrucao.enum";
import { TipoBenfeitoria } from "../../enums/TipoBenfeitoria.enum";
import { TipoCobertura } from "../../enums/TipoCobertura.enum";
import { TipoConstrucao } from "../../enums/TipoConstrucao.enum";
import { TipoEsquadrias } from "../../enums/TipoEsquadrias.enum";
import { tipoSoloBenfeitoriaEnum } from "../../enums/tipoSoloBenfeitoria.enum copy";
import { transporteEnum } from "../../enums/transporte.enum";

export interface BenfeitoriaInput {
    
    tipoBenfeitoria: TipoBenfeitoria | "" | null;
    funcao: Funcao | "" | null;
    afastamentoDaPrincipal: string;
    impermeabilizacaoSolo: tipoSoloBenfeitoriaEnum | "" | null;
    limites: string;
    areaBenfeitoria: number;
    pavimentos: number;
    paredes: TipoConstrucao | "" | null;
    tipoCobertura: TipoCobertura | "" | null;
    tipoEsquadrias: TipoEsquadrias | "" | null;
    origemMadeiraDaConstrucao: origemMaterialConstrucao | "" | null;
    origemPedraDaConstrucao: origemMaterialConstrucao | "" | null;
    origemAreiaDaConstrucao: origemMaterialConstrucao | "" | null;
    alagamentos: string;
    epocaOcorrencia: string;
    efluentes: string;
    residuos: string;
    fonteEnergia: string;
    energiaAlimentos: string;
    meiosLocomocao: transporteEnum | "" | null;
    linhasOnibus: string;
    informativoPredominante: string;
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
