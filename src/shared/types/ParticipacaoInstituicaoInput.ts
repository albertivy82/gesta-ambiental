// ParticipacaoInstituicao.ts

import { Instituicao } from "../../enums/Instituicao.enum";


export interface ParticipacaoInstituicaoInput {
    instituicao: string;
    tipoDeRgistro: string;
    Registro: string;
    morador: {
        id: number;
    }
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    
}
