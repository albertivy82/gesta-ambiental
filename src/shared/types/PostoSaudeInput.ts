import { SimNao } from "../../enums/simNao.enum";

export interface postoSaudeInput {
  nome: string;
  ambulatorial: SimNao | "" | null;
  urgenciaEmergencia: SimNao | "" | null;
  medicosPorTurno: number;
  localidade: {
    id: number;
  };
 sincronizado?: boolean;
 idLocal?: string;
 }
