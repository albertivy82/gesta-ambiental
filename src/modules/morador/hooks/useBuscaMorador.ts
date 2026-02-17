import { useState } from "react";
import { getMoradores } from "../../../realm/services/moradorService";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { MoradorType } from "../../../shared/types/MoradorType";

export const useBuscaMorador = (
    benfeitoria: BenfeitoriaType,
    morador?: MoradorType
  ) => {
    const [moradores, setMoradores] = useState<MoradorType[]>([]);
    const [temEntrevistado, setTemEntrevistado] = useState(false);
  
    if (!morador) {
      const listaMoradores = getMoradores(benfeitoria.id);
      setMoradores(listaMoradores);
  
      setTemEntrevistado(
        listaMoradores.some((m) => m.perfil === "ENTREVISTADO")
      );
    }
  
    return {
     temEntrevistado,
    };
  };
  

