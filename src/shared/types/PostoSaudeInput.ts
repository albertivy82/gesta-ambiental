import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface postoSaudeInput {
  nome: string;
  ambulatorial: SimNaoTalvez | "" | null;
  urgenciaEmergencia: SimNaoTalvez | "" | null;
  medicosPorTurno: number;
  localidade: {
    id: number;
  };
  sincronizado?: boolean;
  idLocal?: string;
}
