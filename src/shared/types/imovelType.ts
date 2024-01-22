import { documentacao } from "../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../enums/limitesTerreno.enum";
import { simNao } from "../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../enums/tipoSolo.enum";
import { transporteEnum } from "../../enums/transporte.enum";

export interface imovelBody{

    id: number;
    rua: string | null | undefined;
    numero: string | null | undefined;
    bairro: string | null | undefined;
    referencial: string;
    latitude: string;
    longitude:string;
    situacaoFundiaria: situacaoFundiaria;
    documentacaoImovel: documentacao;
    dataChegada: string;
    pretendeMudar: simNao;
    motivoVontadeMudanca: string | null | undefined;
    relacaoArea: string;
    relacaoVizinhos:string;
    limites: limitesTerrenoEnum;
    transporte: transporteEnum;
    linhasDeBarco: string;
    tipoSolo: tipoSoloEnum;
    esporteLazer:esporteLazerEnum;   
    sincronizado: boolean;
    idLocal: string;
    localidade: {
        id:number;
    }
}