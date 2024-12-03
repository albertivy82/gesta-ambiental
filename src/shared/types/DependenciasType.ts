import { DependenciasEnum } from "../../enums/Dependencias.enum";

export interface DependenciaType {

    id: number;
    dependencia: DependenciasEnum | null|"";
    quantidade: number;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}