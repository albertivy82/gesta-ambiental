import { municipiosEnum } from "../../enums/municipios.enum";

export interface localidadeInputType{
    nome: string;
    municipio: municipiosEnum | "" | null;

}