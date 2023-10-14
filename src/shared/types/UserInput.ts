import { grupoEnum } from "../../enums/grupo.enum";


export interface UserInput {
    
    nome: string;
    matricula: string;
    email: string;
    cpf: string;
    grupo: grupoEnum| "" | null;

}