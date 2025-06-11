import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface MamiferosType {
    id: number;
    especie: string;
    usoConsumo: string;
    local: string;
    usoDaEspecie: string;
    problemasGerados: string;
    alimentacao:  string;
    desricaoEspontanea: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
