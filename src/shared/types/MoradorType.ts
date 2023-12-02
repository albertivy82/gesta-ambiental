import { simNao } from "../../enums/simNaoTalvez.enum";

export interface MoradorType {
    id: number;
    dataNascimento: string; 
    idade: number;
    perfil: string; 
    sexo: string; 
    estadoCivil: string; 
    escolaridade: string; 
    ondeEstuda?: string;
    trabalho: simNao; 
    religiao: string;
    benfeitoria: {
        id:number;
    }
}
