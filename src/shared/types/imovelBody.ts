import { esporteLazerEnum } from "../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../enums/limitesTerreno.enum";
import { transporteEnum } from "../../enums/transporte.enum";

export interface imovelBody{

    id: number;
    rua: string;
    numero: string,
    bairro: string;
    referencial: string;
    latitude: string;
    longitude:string;
    dataChegada: string;
    pretendeMudar: string;
    motivoVontadeMudanca: string;
    relacaoComArea: string;
    relacaoComVizinhos:string;
    limitesTerreno: limitesTerrenoEnum;
    meioTranporteDominante: transporteEnum;
    linhasDeBarco: string;
    tipoSolo: transporteEnum;
    eporteLazer:esporteLazerEnum;   
    localidade: {
        id:number;
    }
}