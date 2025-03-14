import { Escolaridade } from "../../enums/Escolaridade";
import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Perfil } from "../../enums/Perfil";
import { Sexo } from "../../enums/Sexo";
import { SimNao } from "../../enums/simNao.enum";

export interface MoradorType {
    id: number;
    dataNascimento: string; 
    idade: number;
    perfil: Perfil|null|''; 
    sexo: Sexo|null|''; 
    estadoCivil: EstadoCivil|null|''; 
    escolaridade: Escolaridade|null|''; 
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
