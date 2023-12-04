import { PerfilDoIndicado } from "../../enums/PerfilDoIndicado";

export interface IndicadoConsultaPublica {
    id: number;
    nome: string;
    perfil: PerfilDoIndicado; 
    telefone: string;
    entrevistador: {
        id:number;
    }
}
