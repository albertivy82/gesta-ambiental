import { useState } from "react";
import { getBenfeitoria, getBenfeitoriaDessincronizadaPorId } from "../../../realm/services/benfeitoriaService";
import { getEntrevistadoDessincronizadoPorId, getEntrevistadoPorId } from "../../../realm/services/entrevistado";
import { getImovelDessincronizadoPorId, getImovelPorId } from "../../../realm/services/imovelService";
import { getMoradorComPaiOffLine, getMoradores } from "../../../realm/services/moradorService";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
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
  

