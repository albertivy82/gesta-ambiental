// ParticipacaoInstituicao.ts

import { Instituicao } from "../../enums/Instituicao.enum";


export interface ParticipacaoInstituicao {
    id: number;
    instituicao: Instituicao;
    tipoDeRgistro: string;
    Registro: string;
    morador: {
        id: number;
    }
}
