import { Exploracao } from "../../enums/Exploracao.enum";
import { TamanhoPesca } from "../../enums/tamanhoPesca.enum";

export interface EspecieType {
    id: number;
    especie: string;
    quantidadePescada: number;
    tamanhoDaPesca: TamanhoPesca|''|null;
    exploracaoNivel: Exploracao|''|null;
    precoVendaMedioKg: number;
    importancia: string;
    mesesMaiorOcorrencia: string;
    pescaArtesanal: {
        id: number;
    } 
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}