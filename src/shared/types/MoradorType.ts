import { Perfil } from "../../enums/Perfil";
import { Sexo } from "../../enums/Sexo";

export interface MoradorType {
   id: number;
   perfil: Perfil| null| ''; 
    idade: number;
    sexo: Sexo| null| ''; 
    escolaridade: string; 
    estadoCivil: string;  
    ondeEstuda: string;
    trabalho: string; 
    religiao: string;
    doencas:string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
