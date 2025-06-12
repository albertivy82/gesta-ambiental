
export interface AvesInput {
    
    especie: string;
    climaOcorrencia: string;
    usosDaEspecie: string;
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
