import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { CreditoInput } from "../../../shared/types/CreditoInput";
import { salvarCreditoQueue } from "../../../realm/services/creditoService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export const DEFAULT_CREDITO_INPUT: CreditoInput = {
  nome: '',
  valor: 0,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoCredito = (benfeitoria: BenfeitoriaType) => {
  const [novoCredito, setNovoCredito] = useState<CreditoInput>(DEFAULT_CREDITO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novoCredito);
    if (
      novoCredito.nome !== null &&
      novoCredito.valor == 0
    ) {
      setDisabled(false);
    }
  }, [novoCredito]);

  const objetoFila = () => {
    const creditoData: CreditoInput = {
      ...novoCredito,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      creditoData.benfeitoria!.id = benfeitoria.id;
      creditoData.idFather = "";
    } else if (benfeitoria.idLocal) {
      creditoData.idFather = benfeitoria.idLocal;
      creditoData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return creditoData;
  };

  const inputCreditoApi = async () => {
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
      const creditoDataQueue = objetoFila();
      console.log("useInputCredito_a", novoCredito);
      salvarCreditoQueue(creditoDataQueue);
    } else {
      novoCredito.benfeitoria = { id: benfeitoria.id };
      console.log(novoCredito.benfeitoria.id, "se não estiver correto, devo obedecer o modo de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputCredito_b", novoCredito);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputCredito_c", novoCredito);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/credito', novoCredito);
          console.log("useInputCredito_d", novoCredito);
        } catch (error) {
          const creditoDataQueue = objetoFila();
          salvarCreditoQueue(creditoDataQueue);
          console.log("useInputCredito_e", novoCredito);
        }
      } else {
        const creditoDataQueue = objetoFila();
        salvarCreditoQueue(creditoDataQueue);
        console.log("useInputCredito_f", novoCredito);
      }
    }
  };

  const handleOnChangeRendimentoMensal = (
          event: NativeSyntheticEvent<TextInputChangeEventData>
        ) => {
          let value = event.nativeEvent.text;
        
          // Remove qualquer caractere não numérico
          value = value.replace(/\D/g, '');
        
          // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
          const formattedValue = (parseInt(value, 10) / 100).toFixed(2);
        
          // Atualiza o estado com o valor formatado como número
          setNovoCredito((current) => ({
            ...current,
            valor: parseFloat(formattedValue), // Salva como número para enviar à API
          }));
  };

  
  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    // Verifica se "value" é um evento ou uma string diretamente
    const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
  
    setNovoCredito((current) => ({
      ...current,
      [name]: newValue,
    }));
  };


  return {
    novoCredito,
    inputCreditoApi,
    handleOnChangeRendimentoMensal,
    handleOnChangeInput,
    disabled,
  };
};
