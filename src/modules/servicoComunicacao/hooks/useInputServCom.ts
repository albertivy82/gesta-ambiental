import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";


export const DEFAULT_SERVICOS_COMUNICACAO_INPUT: ServicosComunicacaoInput = {
  tipoServicoComunicacao: null,
  operadoraServicoComunicacao: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoServicoComunicacao = (benfeitoria: EntrevistadoType) => {
  const [novoServicoComunicacao, setNovoServicoComunicacao] = useState<ServicosComunicacaoInput>(DEFAULT_SERVICOS_COMUNICACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novoServicoComunicacao);
    if (
      novoServicoComunicacao.tipoServicoComunicacao !== null &&
      novoServicoComunicacao.operadoraServicoComunicacao !== null
    ) {
      setDisabled(false);
    }
  }, [novoServicoComunicacao]);

  const objetoFila = () => {
    const servicosComunicacaoData: ServicosComunicacaoInput = {
      ...novoServicoComunicacao,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      servicosComunicacaoData.benfeitoria!.id = benfeitoria.id;
      servicosComunicacaoData.idFather = "";
    } else if (benfeitoria.idLocal) {
      servicosComunicacaoData.idFather = benfeitoria.idLocal;
      servicosComunicacaoData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return servicosComunicacaoData;
  };

  const inputServicoComunicacaoApi = async () => {
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
      const servicosComunicacaoDataQueue = objetoFila();
      console.log("useInputServicoComunicacao_a", novoServicoComunicacao);
      salvarServicosComunicacaoQueuem(servicosComunicacaoDataQueue);
    } else {
      novoServicoComunicacao.benfeitoria = { id: benfeitoria.id };
      console.log(novoServicoComunicacao.benfeitoria.id, "se não estiver correto, devo obedecer o modo de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputServicoComunicacao_b", novoServicoComunicacao);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputServicoComunicacao_c", novoServicoComunicacao);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/servicos-comunicacao', novoServicoComunicacao);
          console.log("useInputServicoComunicacao_d", novoServicoComunicacao);
        } catch (error) {
          const servicosComunicacaoDataQueue = objetoFila();
          salvarServicosComunicacaoQueue(servicosComunicacaoDataQueue);
          console.log("useInputServicoComunicacao_e", novoServicoComunicacao);
        }
      } else {
        const servicosComunicacaoDataQueue = objetoFila();
        salvarServicosComunicacaoQueue(servicosComunicacaoDataQueue);
        console.log("useInputServicoComunicacao_f", novoServicoComunicacao);
      }
    }
  };

  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    const newValue = typeof value === 'string' ? value : value.nativeEvent.text;

    setNovoServicoComunicacao((current) => ({
      ...current,
      [name]: newValue,
    }));
  };

  const handleEnumChange = (field: keyof ServicosComunicacaoInput, value: any) => {
    setNovoServicoComunicacao((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (field: keyof ServicosComunicacaoInput, values: string[]) => {
    const concatenatedValues = values.join(', ');
    setNovoServicoComunicacao((currentState) => ({
      ...currentState,
      [field]: concatenatedValues,
    }));
  };

  return {
    novoServicoComunicacao,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    disabled,
  };
};
