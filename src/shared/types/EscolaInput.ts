import { EsferaEnum } from "../../enums/esfera.enum";
import { SimNao } from "../../enums/simNao.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface escolaInput {
  nome: string;
  iniciativa: EsferaEnum| "" | null;
  merenda: SimNao | "" | null; 
  transporte: SimNao | "" | null; 
  educacaoAmbiental: SimNao | "" | null;
  localidade: {
      id: number;
  }
  sincronizado?: boolean;
  idLocal?: string;
}

