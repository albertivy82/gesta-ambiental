import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Perfil } from "../../enums/Perfil";
import { Sexo } from "../../enums/Sexo";

export interface MoradorInput{
   
    perfil: Perfil| null| ''; 
    dataNascimento: number;
    sexo: Sexo| null| ''; 
    escolaridade: string; 
    estadoCivil: EstadoCivil | null| ''; 
    ondeEstuda?: string;
    trabalho: string; 
    religiao: string;
    doencas:string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
