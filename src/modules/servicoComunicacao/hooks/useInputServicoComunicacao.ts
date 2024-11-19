import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";

export const DEFAULT_SERVICOS_COMUNICACAO_INPUT: ServicosComunicacaoInput = {
  tipoServicoComunicacao: null,
  operadoraServicoComunicacao: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoServicoComunicacao = (id: number) => {
  const [novoServicoComunicacao, setNovoServicoComunicacao] = useState<ServicosComunicacaoInput>(DEFAULT_SERVICOS_COMUNICACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoServicoComunicacao);
    if (
      novoServicoComunicacao.tipoServicoComunicacao !== null &&
      novoServicoComunicacao.operadoraServicoComunicacao !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoServicoComunicacao]);

  const objetoFila = () => {
    const servicoComunicacaoData: ServicosComunicacaoInput = {
      ...novoServicoComunicacao,
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return servicoComunicacaoData;
  };
}