export interface EscolaType {
    id: number;
    nome: string;
    iniciativa: string;
    merenda: string; 
    transporte: string; 
    educacaoAmbiental: string; 
    localidade: {
        id: number;
    }
    sincronizado: boolean;
    idLocal?: string;
}
