import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface MamiferosType {
    id: number;
    especie: string;
    usoConsumo: SimNaoTalvez |null|'';
    usoComercio: SimNaoTalvez |null|'';
    usoCriacao: SimNaoTalvez |null|'';
    usoRemedio: SimNaoTalvez |null|'';
    usoOutros:  SimNaoTalvez |null|'';
    problemasRelacionados: string;
    alimentacao: string;
    desricaoEspontanea: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
