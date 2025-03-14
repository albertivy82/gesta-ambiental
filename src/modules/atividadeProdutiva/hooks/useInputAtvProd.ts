import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { AtividadeProdutivaInput } from "../../../shared/types/AtividadeProdutivaInput";
import { salvarAtividadeProdutivaQueue } from "../../../realm/services/atividadeProdutivaService";

export const DEFAULT_ATIVIDADE_PRODUTIVA_INPUT: AtividadeProdutivaInput = {
  atividade: null,
  pessoasEnvolvidas: 0,
  faturamentoAtividadeMesTotal: 0,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAtvProd = (benfeitoria:EntrevistadoType)  => {
  const [novaAtividade, setNovaAtvProd] = useState<AtividadeProdutivaInput>(DEFAULT_ATIVIDADE_PRODUTIVA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAtividade);
    if (
      novaAtividade.atividade !== null &&
      novaAtividade.pessoasEnvolvidas > 0 &&
      novaAtividade.faturamentoAtividadeMesTotal > 0
    ) {
      setDisabled(false);
    }
  }, [novaAtividade]);

  const objetoFila = () => {
    const atvProdData: AtividadeProdutivaInput = {
        ...novaAtividade, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (benfeitoria.id > 0) {
        atvProdData.benfeitoria!.id = benfeitoria.id;
        atvProdData.idFather = "";
    } else if (benfeitoria.idLocal) {
        atvProdData.idFather = benfeitoria.idLocal;
        atvProdData.benfeitoria!.id = benfeitoria.id;
    } else {
        console.warn("ID local do benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return atvProdData;
  };
  

  const inputAtvProdApi = async () => {
    
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
        const atvProdDataQueue = objetoFila();
        console.log("useInputAtvProd_a", novaAtividade)
        salvarAtividadeProdutivaQueue(atvProdDataQueue);
    } else {
      novaAtividade.benfeitoria = { id: benfeitoria.id };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
        console.log("useInputAtvProd_b", novaAtividade)
  
        if (netInfoState.isConnected && isConnected) {
          console.log("useInputAtvProd_c", novaAtividade)
            try {
                await connectionAPIPost('http://192.168.100.28:8080/atividade-produtiva', novaAtividade);
                console.log("useInputAtvProd_d", novaAtividade)
            } catch (error) {
                const atvProdDataQueue = objetoFila();
                salvarAtividadeProdutivaQueue(atvProdDataQueue);
                console.log("useInputAtvProd_e", novaAtividade)
            }
        } else {
            const atvProdDataQueue = objetoFila();
            salvarAtividadeProdutivaQueue(atvProdDataQueue);
            console.log("useInputAtvProd_f", novaAtividade)
        }
    }
  };


   const handleOnChangeInput = (
      value: NativeSyntheticEvent<TextInputChangeEventData> | string,
      name: string
    ) => {
      // Verifica se "value" é um evento ou uma string diretamente
      const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
    
      setNovaAtvProd((current) => ({
        ...current,
        [name]: newValue,
      }));
    };

  const handleEnumChange = (field: keyof AtividadeProdutivaInput, value: any) => {
    setNovaAtvProd((current) => ({
           ...current,
           [field]: value,
         }));
  };

  const handleArrayFieldChange = (field: keyof AtividadeProdutivaInput, values: string[]) => {
             const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
             setNovaAtvProd((currentState) => ({
               ...currentState,
               [field]: concatenatedValues,
             }));
  };


  return {
    novaAtividade,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    disabled,
};
  


}  