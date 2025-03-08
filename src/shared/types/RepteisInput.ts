export interface RepteisInput {
    
    especie: string;
    local: string;
    periodo: string;
    uso: string;
    ameacado: string;
    problemasRelacionados: string;
    cacado: string;
    descricaoEspontanea: string;
    entrevistado: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
