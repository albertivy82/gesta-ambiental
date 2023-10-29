export interface EscolaType {
    id: number;
    nome: string;
    merenda: string; 
    transporte: string; 
    educacaoAmbiental: string; 
    localidade: {
        id: number;
    }
}
