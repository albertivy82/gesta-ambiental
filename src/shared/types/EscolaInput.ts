import { EsferaEnum } from "../../enums/esfera.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface escolaInput {
  nome: string;
  iniciativa: EsferaEnum| "" | null;
  merenda: SimNaoTalvez | "" | null; 
  transporte: SimNaoTalvez | "" | null; 
  educacaoAmbiental: SimNaoTalvez | "" | null;
  localidade: {
      id: number;
  }
  sincronizado?: boolean;
  idLocal?: string;
}

