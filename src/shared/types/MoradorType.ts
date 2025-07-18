import { Escolaridade } from "../../enums/Escolaridade";
import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Perfil } from "../../enums/Perfil";
import { Sexo } from "../../enums/Sexo";
import { SimNao } from "../../enums/simNao.enum";

export interface MoradorType {
   id: number;
   perfil: Perfil| null| ''; 
   dataNascimento: string;
   sexo: Sexo| null| ''; 
   escolaridade: Escolaridade|null|''; 
   estadoCivil: EstadoCivil | null| ''; 
   ondeEstuda?: string;
   trabalho: SimNao|null|''; 
   religiao: string;
   doencas:string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
