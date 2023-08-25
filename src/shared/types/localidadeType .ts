import { municipiosEnum } from "../../enums/municipios.enum";

export interface localidadeType{
    nome: string;
    municipio: municipiosEnum | "" | null;

}