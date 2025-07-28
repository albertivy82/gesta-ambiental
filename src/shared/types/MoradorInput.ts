import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Perfil } from "../../enums/Perfil";
import { Sexo } from "../../enums/Sexo";
import { SimNao } from "../../enums/simNao.enum";

export interface MoradorInput{
   
    perfil: Perfil| null| ''; 
    dataNascimento: number;
    sexo: Sexo| null| ''; 
    escolaridade: string; 
    estadoCivil: EstadoCivil | null| ''; 
    ondeEstuda?: string;
    trabalho: SimNao|null|''; 
    religiao: string;
    doencas:string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
