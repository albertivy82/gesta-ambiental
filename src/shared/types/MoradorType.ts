export interface MoradorType {
    id: number;
    dataNascimento: string; 
    idade: number;
    perfil: string; 
    sexo: string; 
    estadoCivil: string; 
    escolaridade: string; 
    ondeEstuda?: string;
    trabalho: string; 
    religiao: string;
    doencaIds: number[]; 
    benfeitoriaId: number;
}
