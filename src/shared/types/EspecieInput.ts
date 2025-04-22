import { Exploracao } from "../../enums/Exploracao.enum";
import { TamanhoPesca } from "../../enums/tamanhoPesca.enum";

export interface EspecieInput {
    especie: string;
    quantidadePescada: number;
    quantidadeDaPesca: TamanhoPesca;
    tamanhoDaPesca: TamanhoPesca;
    exploracaoNivel: Exploracao;
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