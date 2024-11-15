import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface escolaInput {
  nome: string;
  endereco: string;
  numeroAlunos: number;
  tipoEnsino: string;
  horarioFuncionamento: string;
  possuiTransporteEscolar: SimNaoTalvez | "" | null;
  possuiLaboratorio: SimNaoTalvez | "" | null;
  possuiQuadraEsportiva: SimNaoTalvez | "" | null;
  localidade: {
    id: number;
  };
  sincronizado?: boolean;
  idLocal?: string;
}
