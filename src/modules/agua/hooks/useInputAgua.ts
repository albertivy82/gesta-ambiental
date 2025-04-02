import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarAguaQueue } from "../../../realm/services/aguasService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AguaInput } from "../../../shared/types/AguaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";

export const DEFAULT_AGUA_INPUT: AguaInput = {
  tipoDeFornecimento: '',
  qualidadeDaAgua: '',
  metodoTratamento: '',
  corDagua: '',
  cheiroDagua: '',
  saborDagua: '',
  profundidadePoco: 0,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAgua = (benfeitoria: BenfeitoriaType) => {
  const [novaAgua, setNovaAgua] = useState<AguaInput>(DEFAULT_AGUA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAgua);
    if (
      novaAgua.tipoDeFornecimento !== '' &&
      novaAgua.qualidadeDaAgua !== '' &&
      novaAgua.metodoTratamento !== '' &&
      novaAgua.corDagua !== '' &&
       novaAgua.cheiroDagua !== ''&&
        novaAgua.saborDagua !== ''
      
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

  const handleArrayFieldChange = (field: keyof AguaInput, values: string[]) => {
          const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
          setNovaAgua((currentState) => ({
            ...currentState,
            [field]: concatenatedValues,
          }));
        };

  const handleEnumChange = (field: keyof AguaInput, value: any) => {
          setNovaAgua((current) => ({
            ...current,
            [field]: value,
          }));
  };

  return {
    novaAgua,
    inputAguaApi,
    handleArrayFieldChange,
    handleEnumChange,
    disabled,
  };
};
