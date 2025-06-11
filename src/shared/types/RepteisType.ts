export interface RepteisType {
    id: number;
    especie: string;
    local: string;
    desova: string;
    localDesova: string;
    periodoDesova: string;
    usoDaEspecie: string;
    ameacaParaEspecie: string;
    problemasGerados: string;
    descricaoEspontanea: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
