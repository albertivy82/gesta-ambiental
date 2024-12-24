import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface MamiferosInput {
    
    especie: string;
    usoConsumo: SimNaoTalvez |null|'';
    usoComercio: SimNaoTalvez |null|'';
    usoCriacao: SimNaoTalvez |null|'';
    usoRemedio: SimNaoTalvez |null|'';
    usoOutros:  SimNaoTalvez |null|'';
    problemasRelacionados: string;
    alimentacao: string;
    desricaoEspontanea: string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}