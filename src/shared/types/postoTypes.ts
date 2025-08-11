import { SimNao } from "../../enums/simNao.enum";

export interface PostoType {

    id: number;
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

  