export interface ViolenciaType {
    id: number;
    tipo: string; 
    condicao: string; 
    ocorrencias: number;
    destaqueDoMorador?: string;
    benfeitoria:{
        id: number;
    } 
}
