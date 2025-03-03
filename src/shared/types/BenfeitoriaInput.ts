import { Efluentes } from "../../enums/Efluentes.enum";
import { EnergiaAlimentos } from "../../enums/EnergiaAlimentos.enum";
import { FonteEnergia } from "../../enums/FonteEnergia.enum";
import { Funcao } from "../../enums/Funcao.enum";
import { InformativoPredominante } from "../../enums/InformativoPredominante.enum";
import { NivelAlagamento } from "../../enums/NivelAlagamento.enum";
import { origemMaterialConstrucao } from "../../enums/OrigemMaterialConstrucao.enum";
import { Residuos } from "../../enums/Residuos.enum";
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
    efluentes: Efluentes | "" | null;
    residuos: Residuos | "" | null;
    fonteEnergia: FonteEnergia | "" | null;
    energiaAlimentos: EnergiaAlimentos | "" | null;
    meiosLocomocao: transporteEnum | "" | null;
    linhasOnibus: string;
    informativoPredominante: InformativoPredominante | "" | null;
    imovel: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
