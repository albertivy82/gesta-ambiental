import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { InstituicaoConhecidaInput } from "../../../shared/types/instituicaoConhecidaInput";
import { AtividadeProdutivaInput } from "../../../shared/types/AtividadeProdutivaInput";
import { ViolenciaInput } from "../../../shared/types/violenciaInput";

export const DEFAULT_VIOLENCIA_INPUT: ViolenciaInput = {
  tipo: null,
  condicao: null,
  ocorrencias: 0,
  destaqueDoMorador: '',
  benfeitoria: {
    id: 0,
  },
  sincronizado: false,
  idLocal: undefined,
  idFather: undefined,
};

// Hook para manipular um novo registro de `Violencia`
export const useNovaViolencia = (id: number) => {
  const [novaViolencia, setNovaViolencia] = useState<ViolenciaInput>(
    DEFAULT_VIOLENCIA_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaViolencia);
    if (
      novaViolencia.tipo !== null &&
      novaViolencia.condicao !== null &&
      novaViolencia.ocorrencias > 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaViolencia]);

  const objetoFila = () => {
    const violenciaData: ViolenciaInput = {
      ...novaViolencia,
      benfeitoria: {
        id: id,
      },
    };
    return violenciaData;
  };

  }  