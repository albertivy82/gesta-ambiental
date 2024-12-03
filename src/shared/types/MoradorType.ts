import { Escolaridade } from "../../enums/Escolaridade";
import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Perfil } from "../../enums/Perfil";
import { Sexo } from "../../enums/Sexo";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface MoradorType {
    id: number;
    dataNascimento: string; 
    idade: number;
    perfil: Perfil|null|''; 
    sexo: Sexo|null|''; 
    estadoCivil: EstadoCivil|null|''; 
    escolaridade: Escolaridade|null|''; 
    ondeEstuda?: string;
    trabalho: SimNaoTalvez|null|''; 
    religiao: string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
