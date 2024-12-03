import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { InstituicaoConhecidaInput } from "../../../shared/types/instituicaoConhecidaInput";

// Valor padrão para `InstituicaoConhecidaInput`
export const DEFAULT_INSTITUICAO_CONHECIDA_INPUT: InstituicaoConhecidaInput = {
  
  nome: '',
  atividades: '',
  benfeitoria: {
    id: 0,
  },
};

// Hook para manipular um novo registro de `InstituicaoConhecida`
export const useNovaInstituicaoConhecida = (id: number) => {
  const [novaInstituicao, setNovaInstituicao] = useState<InstituicaoConhecidaInput>(
    DEFAULT_INSTITUICAO_CONHECIDA_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaInstituicao);
    if (novaInstituicao.nome !== '' && novaInstituicao.atividades !== '') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaInstituicao]);

  const objetoFila = () => {
    const instituicaoData: InstituicaoConhecidaInput = {
      ...novaInstituicao,
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return instituicaoData;
  };

  }  