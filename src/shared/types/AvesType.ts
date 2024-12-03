import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface AvesType {
    id: number;
    especie: String;
    useCosumo: SimNaoTalvez|null|'';
    usoComercio: SimNaoTalvez|null|'';
    usoCriacao: SimNaoTalvez|null|'';
    usoRemedio: SimNaoTalvez|null|'';
    usoOutros: SimNaoTalvez|null|'';
    problemasRelacionados: string;
    ameacaSofrida: string;
    localDeAglomeracao: string;
	qualImpotanciaDaEespecie: string;
	alimentacao: string;
	desricaoEspontanea: string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
