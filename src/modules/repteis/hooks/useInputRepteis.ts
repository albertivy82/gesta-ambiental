import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { RepteisType } from "../../../shared/types/RepteisType";
import { salvarReptilQueue } from "../../../realm/services/repteisService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { RepteisInput } from "../../../shared/types/RepteisInput";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export const DEFAULT_REPTEIS_INPUT: RepteisType = {
  id: 0,
  especie: '',
  local: '',
  periodo: '',
  uso: '',
  ameacado: '',
  problemasRelacionados: '',
  cacado: '',
  descricaoEspontanea: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovoReptil = (entrevistado: EntrevistadoType) => {
  const [novoReptil, setNovoReptil] = useState<RepteisType>(DEFAULT_REPTEIS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoReptil);
    if (
      novoReptil.especie !== '' &&
      novoReptil.local !== '' &&
      novoReptil.periodo !== '' &&
      novoReptil.uso !== '' &&
      novoReptil.ameacado !== '' &&
      novoReptil.problemasRelacionados !== '' &&
      novoReptil.cacado !== '' &&
      novoReptil.descricaoEspontanea !== ''
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoReptil]);

  const objetoFila = () => {
    const reptilData: RepteisType = {
      ...novoReptil,
      id: 0,  // ID será gerado pelo backend após sincronização
      idLocal: uuidv4(),
      sincronizado: false,
    };

    if (entrevistado.id > 0) {
      reptilData.entrevistado!.id = entrevistado.id;
      reptilData.idFather = "";
    } else if (entrevistado.idLocal) {
      reptilData.idFather = entrevistado.idLocal;
      reptilData.entrevistado!.id = entrevistado.id;
    } else {
      console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }

    return reptilData;
  };

  const inputReptilApi = async () => {
    if (!entrevistado.sincronizado && entrevistado.id <= 0) {
      const reptilDataQueue = objetoFila();
      console.log("useInputReptil_a", novoReptil);
      salvarReptilQueue(reptilDataQueue);
    } else {
      novoReptil.entrevistado = { id: entrevistado.id };
      console.log(novoReptil.entrevistado.id, "se não estiver correto, devo obedecer o modo do de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputReptil_b", novoReptil);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputReptil_c", novoReptil);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/repteis', novoReptil);
          console.log("useInputReptil_d", novoReptil);
        } catch (error) {
          const reptilDataQueue = objetoFila();
          salvarReptilQueue(reptilDataQueue);
          console.log("useInputReptil_e", novoReptil);
        }
      } else {
        const reptilDataQueue = objetoFila();
        salvarReptilQueue(reptilDataQueue);
        console.log("useInputReptil_f", novoReptil);
      }
    }
  };

  const handleOnChangeInput = (
        value: NativeSyntheticEvent<TextInputChangeEventData> | string,
        name: string
      ) => {
        // Verifica se "value" é um evento ou uma string diretamente
        const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
      
        setNovoReptil((current) => ({
          ...current,
          [name]: newValue,
        }));
      };
  
    
  
  
    return {
      novoReptil,
      handleOnChangeInput,
      disabled,
  };
};
