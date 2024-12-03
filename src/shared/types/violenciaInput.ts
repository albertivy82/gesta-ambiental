import { CondicaoViolencia } from "../../enums/consicaoViolenvia.enum";
import { ViolenciaTipo } from "../../enums/ViolenciaTipoe.enum";

export interface ViolenciaInput {
   
    tipo: ViolenciaTipo|null|''; 
    condicao: CondicaoViolencia|null|''; 
    ocorrencias: number;
    destaqueDoMorador?: string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
