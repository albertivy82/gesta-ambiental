// ParticipacaoInstituicao.ts

import { Instituicao } from "../../enums/Instituicao.enum";


export interface ParticipacaoInstituicaoType {
    id: number;
    instituicao: Instituicao;
    tipoDeRgistro: string;
    Registro: string;
    morador: {
        id: number;
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
