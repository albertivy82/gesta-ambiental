import { FonteEnergia } from "../../enums/FonteEnergia.enum";
import { Vizinhos } from "../../enums/Vizinhos";
import { documentacao } from "../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../enums/limitesTerreno.enum";
import { SimNao } from "../../enums/simNao.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../enums/tipoSolo.enum";
import { transporteEnum } from "../../enums/transporte.enum";
import { EntrevistadoType } from "./EntrevistadoType";

export interface imovelBody {
   
    id: number;
    rua: string;
    numero: string;
    bairro: string;
    referencial: string;
    latitude: string;
    longitude: string;
    areaImovel: number;
    tipoSolo: tipoSoloEnum | "" | null;
    vizinhosConfinantes: string;
    situacaoFundiaria: situacaoFundiaria | "" | null;
    documentacaoImovel: documentacao | "" | null;
    limites: limitesTerrenoEnum | "" | null;
    linhasDeBarco: string;
    pavimentacao: string;
    iluminacaoPublica: SimNao| "" | null;
    equipamentosUrbanos: string;
    espacosEsporteLazer: esporteLazerEnum | "" | null;
    programaInfraSaneamento: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}





