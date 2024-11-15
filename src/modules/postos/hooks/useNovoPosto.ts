import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { salvarPostoSaudeQueue } from "../../../realm/services/postoService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { postoSaudeInput } from "../../../shared/types/postoSaudeInput";

export const DEFAULT_POSTO_INPUT: postoSaudeInput = {
  nome: "",
  ambulatorial: null,
  urgenciaEmergencia: null,
  medicosPorTurno: 0,
  localidade: {
    id: 0,
  },
};

export const useNovoPosto = (id: number) => {
  const [novoPosto, setNovoPosto] = useState<postoSaudeInput>(DEFAULT_POSTO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  // Habilitar o botão apenas se todos os campos obrigatórios estiverem preenchidos
  useEffect(() => {
    const camposPreenchidos =
      novoPosto.nome !== "" &&
      novoPosto.ambulatorial !== null &&
      novoPosto.urgenciaEmergencia !== null &&
      novoPosto.medicosPorTurno > 0;

    setDisabled(!camposPreenchidos);
  }, [novoPosto]);

  const objetoFila = () => {
    const postoData: postoSaudeInput = {
      ...novoPosto,
      localidade: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return postoData;
  };

  const inputPostoApi = async () => {
    novoPosto.localidade.id = id;
    const netInfoState = await NetInfo.fetch();

    if (netInfoState.isConnected) {
      const isConnected = await testConnection();

      if (isConnected) {
        try {
          await connectionAPIPost("http://192.168.100.28:8080/posto-saude", novoPosto);
        } catch (error) {
          const registroNaoEnviado = objetoFila();
          salvarPostoSaudeQueue(registroNaoEnviado);
          console.error("Objeto armazenado internamente. Erro:", error);
        }
      } else {
        const registroNaoEnviado = objetoFila();
        salvarPostoSaudeQueue(registroNaoEnviado);
      }
    } else {
      const registroNaoEnviado = objetoFila();
      salvarPostoSaudeQueue(registroNaoEnviado);
    }
  };

  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    const newValue = typeof value === "string" ? value : value.nativeEvent.text;
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      [name]: newValue,
    }));
  };

  const handleAmbulatorialChange = (ambulatorial: SimNaoTalvez | "" | null) => {
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      ambulatorial: ambulatorial,
    }));
  };

  const handleUrgenciaEmergenciaChange = (urgenciaEmergencia: SimNaoTalvez | "" | null) => {
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      urgenciaEmergencia: urgenciaEmergencia,
    }));
  };

  const handleMedicosPorTurnoChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const value = parseInt(event.nativeEvent.text.replace(/\D/g, ""), 10) || 0;
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      medicosPorTurno: value,
    }));
  };

  return {
    novoPosto,
    inputPostoApi,
    handleOnChangeInput,
    handleAmbulatorialChange,
    handleUrgenciaEmergenciaChange,
    handleMedicosPorTurnoChange,
    disabled,
  };
};
