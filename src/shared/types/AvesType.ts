import { SimNao } from "../../enums/simNao.enum";

export interface AvesType {
    id: number;
    especie: string;
    useCosumo: SimNao|null|'';
    usoComercio: SimNao|null|'';
    usoCriacao: SimNao|null|'';
    usoRemedio: SimNao|null|'';
    usoOutros: SimNao|null|'';
    problemasRelacionados: string;
    ameacaSofrida: string;
    localDeAglomeracao: string;
	qualImpotanciaDaEespecie: string;
	alimentacao: string;
	descricaoEspontanea: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
