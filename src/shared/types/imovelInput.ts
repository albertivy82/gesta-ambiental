import { Vizinhos } from "../../enums/Vizinhos";
import { documentacao } from "../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../enums/limitesTerreno.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../enums/tipoSolo.enum";
import { transporteEnum } from "../../enums/transporte.enum";

export interface imovelInput {
    
    rua: string;
    numero: string;
    bairro: string;
    referencial: string;
    latitude: string;
    longitude: string;
    areaImovel: number;
    vizinhos: Vizinhos | "" | null;
    situacaoFundiaria: situacaoFundiaria | "" | null;
    documentacaoImovel: documentacao | "" | null;
    limites: limitesTerrenoEnum | "" | null;
    iluminacaoPublica: SimNaoTalvez | "" | null;
    transporte: transporteEnum | "" | null;
    programaInfraSaneamento: string;
    linhasDeBarco: string;
    tipoSolo: tipoSoloEnum | "" | null;
    esporteLazer: esporteLazerEnum | "" | null;
    servicosBasicos: string; 
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
