import { DependenciasEnum } from "../../enums/Dependencias.enum";

export interface DependenciaInput {

    dependencia: DependenciasEnum | null|"";
    quantidade: number;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
    

}