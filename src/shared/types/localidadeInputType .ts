import { EsferaEnum } from "../../enums/esfera.enum";
import { municipiosEnum } from "../../enums/municipios.enum";

export interface localidadeInputType{
    nome: string;
    municipio: municipiosEnum | "" | null;
    esfera: EsferaEnum | "" | null;

}