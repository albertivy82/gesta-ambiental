import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { salvarPeixeQueue } from "../../../realm/services/peixesService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export const DEFAULT_PEIXES_INPUT: PeixesInput = {
  especie: '',
  locaisEspeciais: null,
  locaisEspecificosAlimentacao: null,
  usoAlimnetacao: null,  // Corrigido erro de digitação
  usoComercio: null,
  entrevistado: {
    id: 0,
  },
};

export const useNovoPeixe = (entrevistado: EntrevistadoType) => {
  const [novoPeixe, setNovoPeixe] = useState<PeixesInput>(DEFAULT_PEIXES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoPeixe);
    if (
      novoPeixe.especie !== '' &&
      novoPeixe.locaisEspeciais !== null &&
      novoPeixe.locaisEspecificosAlimentacao !== null &&
      novoPeixe.usoAlimnetacao !== null &&
      novoPeixe.usoComercio !== null
    ) {
      setDisabled(true);
    }
  }, [novoPeixe]);

  const objetoFila = () => {
    const peixeData: PeixesInput = {
      ...novoPeixe,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (entrevistado.id > 0) {
      peixeData.entrevistado!.id = entrevistado.id;
      peixeData.idFather = "";
    } else if (entrevistado.idLocal) {
      peixeData.idFather = entrevistado.idLocal;
      peixeData.entrevistado!.id = entrevistado.id;
    } else {
      console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }

    return peixeData;
  };

  const inputPeixeApi = async () => {
    if (!entrevistado.sincronizado && entrevistado.id <= 0) {
      const peixeDataQueue = objetoFila();
      console.log("useInputPeixe_a", novoPeixe);
      salvarPeixeQueue(peixeDataQueue);
    } else {
      novoPeixe.entrevistado = { id: entrevistado.id };
      console.log(novoPeixe.entrevistado.id, "se não estiver correto, devo obedecer o modo do de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputPeixe_b", novoPeixe);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputPeixe_c", novoPeixe);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/peixe', novoPeixe);
          console.log("useInputPeixe_d", novoPeixe);
        } catch (error) {
          const peixeDataQueue = objetoFila();
          salvarPeixeQueue(peixeDataQueue);
          console.log("useInputPeixe_e", novoPeixe);
        }
      } else {
        const peixeDataQueue = objetoFila();
        salvarPeixeQueue(peixeDataQueue);
        console.log("useInputPeixe_f", novoPeixe);
      }
    }
  };

  const handleOnChangeInput = (
        value: NativeSyntheticEvent<TextInputChangeEventData> | string,
        name: string
      ) => {
        // Verifica se "value" é um evento ou uma string diretamente
        const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
      
        setNovoPeixe((current) => ({
          ...current,
          [name]: newValue,
        }));
      };
  
    const handleEnumChange = (field: keyof PeixesInput, value: any) => {
      setNovoPeixe((current) => ({
             ...current,
             [field]: value,
           }));
    };
  
  
  
    return {
      novoPeixe,
      handleOnChangeInput,
      handleEnumChange,
      disabled,
  };
};
