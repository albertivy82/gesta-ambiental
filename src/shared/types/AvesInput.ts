import { SimNao } from "../../enums/simNao.enum";

export interface AvesInput {
    
    especie: string;
    climaOcorrencia: string;
    usosDaEspécie: string;
    localDeAglomeracao: string;
    problemasGerados: string;
    ameacaSofrida: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
