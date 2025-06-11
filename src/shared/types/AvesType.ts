import { SimNao } from "../../enums/simNao.enum";

export interface AvesType {
    id: number;
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
