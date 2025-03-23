import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { AguaInput } from "../../../shared/types/AguaInput";
import { salvarAguaQueue } from "../../../realm/services/aguasService";

export const DEFAULT_AGUA_INPUT: AguaInput = {
  possuiForneceimentoPublico: null,
  qualidadeFornecimentoPublico: null,
  corAguaForncimentoPublico: '',
  saborAguaFornecimentoPublico: '',
  cheiroAguaFornecimentoPublico: '',
  poco: null,
  profundidadePoco: 0,
  corAguaPoco: '',
  saborAguaPoco: '',
  cheiroAguaPoco: '',
  tratamentoAgua: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAgua = (benfeitoria: EntrevistadoType) => {
  const [novaAgua, setNovaAgua] = useState<AguaInput>(DEFAULT_AGUA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAgua);
    if (
      novaAgua.possuiForneceimentoPublico !== null &&
      novaAgua.qualidadeFornecimentoPublico !== null &&
      novaAgua.corAguaForncimentoPublico !== '' &&
      novaAgua.saborAguaFornecimentoPublico !== '' &&
      novaAgua.cheiroAguaFornecimentoPublico !== '' &&
      novaAgua.poco !== null &&
      novaAgua.profundidadePoco > 0 &&
      novaAgua.corAguaPoco !== '' &&
      novaAgua.saborAguaPoco !== '' &&
      novaAgua.cheiroAguaPoco !== '' &&
      novaAgua.tratamentoAgua !== null
    ) {
      setDisabled(false);
    }
  }, [novaAgua]);

  const objetoFila = () => {
    const aguaData: AguaInput = {
      ...novaAgua,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      aguaData.benfeitoria!.id = benfeitoria.id;
      aguaData.idFather = "";
    } else if (benfeitoria.idLocal) {
      aguaData.idFather = benfeitoria.idLocal;
      aguaData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return aguaData;
  };

  const inputAguaApi = async () => {
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
      const aguaDataQueue = objetoFila();
      console.log("useInputAgua_a", novaAgua);
      salvarAguaQueue(aguaDataQueue);
    } else {
      novaAgua.benfeitoria = { id: benfeitoria.id };
      console.log(novaAgua.benfeitoria.id, "se não estiver correto, devo obedecer o modo de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputAgua_b", novaAgua);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputAgua_c", novaAgua);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/agua', novaAgua);
          console.log("useInputAgua_d", novaAgua);
        } catch (error) {
          const aguaDataQueue = objetoFila();
          salvarAguaQueue(aguaDataQueue);
          console.log("useInputAgua_e", novaAgua);
        }
      } else {
        const aguaDataQueue = objetoFila();
        salvarAguaQueue(aguaDataQueue);
        console.log("useInputAgua_f", novaAgua);
      }
    }
  };

  return {
    novaAgua,
    inputAguaApi,
    disabled,
  };
};
