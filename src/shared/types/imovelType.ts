import { Vizinhos } from "../../enums/Vizinhos";
import { documentacao } from "../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../enums/limitesTerreno.enum";
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
    vizinhos: Vizinhos | "" | null;
    situacaoFundiaria: situacaoFundiaria | "" | null;
    documentacaoImovel: documentacao | "" | null;
    limites: limitesTerrenoEnum | "" | null;

    caratwerizaçção do imovel: miToRadians, misto, comércio/criação/plantação etc
   
    fonteDeEnergia:

    meiosLocomocao: transporteEnum | "" | null;
    
    linhasDeBarco: string;
    
    
    
    pavimentacao: pavimentacaoEnum|""|null;
    iluminacaoPublica: SimNaoTalvez | "" | null;
    equipamntosUrbanos:
    espacosEsporteLazer: esporteLazerEnum | "" | null;
    programaInfraSaneamento: string;


    servicosBasicos: string; 
    
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}





