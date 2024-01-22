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
    areaImovel: number,
    vizinhos: Vizinhos |""| null;
    situacaoFundiaria: situacaoFundiaria | "" | null;
    documentacaoImovel: documentacao | "" | null;
    dataChegada: string;
    pretendeMudar: SimNaoTalvez | "" | null;
    motivoVontadeMudanca: string;
    relacaoArea: string;
    relacaoVizinhos: string;
    limites: limitesTerrenoEnum | "" | null;
    iluminacaoPublica: SimNaoTalvez | "" | null;
    programaInfraSaneamento: string;
    transporte: transporteEnum | "" | null;
    linhasDeBarco: string;
    tipoSolo: tipoSoloEnum | "" | null;
    esporteLazer: esporteLazerEnum | "" | null;
    localidade: {
        id: number;
    };
}
