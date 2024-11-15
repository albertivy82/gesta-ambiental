import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { escolaInput } from "../../../shared/types/EscolaInput";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { salvarEscolaQueue } from "../../../realm/services/escolaService";


export const DEFAULT_ESCOLA_INPUT: escolaInput = {
  nome: "",
  endereco: "",
  numeroAlunos: 0,
  tipoEnsino: "",
  horarioFuncionamento: "",
  possuiTransporteEscolar: null,
  possuiLaboratorio: null,
  possuiQuadraEsportiva: null,
  localidade: {
    id: 0,
  },
};

export const useNovaEscola = (id: number) => {
  const [novaEscola, setNovaEscola] = useState<escolaInput>(DEFAULT_ESCOLA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (
      novaEscola.nome !== "" &&
      novaEscola.endereco !== "" &&
      novaEscola.numeroAlunos > 0 &&
      novaEscola.tipoEnsino !== "" &&
      novaEscola.horarioFuncionamento !== "" &&
      novaEscola.possuiTransporteEscolar !== null &&
      novaEscola.possuiLaboratorio !== null &&
      novaEscola.possuiQuadraEsportiva !== null
    ) {
      setDisabled(true);
    }
  }, [novaEscola]);

  const objetoFila = () => {
    const escolaData: escolaInput = {
      ...novaEscola,
      localidade: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return escolaData;
  };

  const inputEscolaApi = async () => {
    novaEscola.localidade.id = id;
    const netInfoState = await NetInfo.fetch();

    if (netInfoState.isConnected) {
      const isConnected = await testConnection();
      if (isConnected) {
        try {
          await connectionAPIPost("http://192.168.100.28:8080/escola",novaEscola);
        } catch (error) {
          const registroNaoEnviado = objetoFila();
          salvarEscolaQueue(registroNaoEnviado);
          console.error("Objeto armazenado internamente. Erro:", error);
        }
      } else {
        const registroNaoEnviado = objetoFila();
        salvarEscolaQueue(registroNaoEnviado);
      }
    } else {
      const registroNaoEnviado = objetoFila();
      salvarEscolaQueue(registroNaoEnviado);
    }
  };

  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    const newValue = typeof value === "string" ? value : value.nativeEvent.text;

    setNovaEscola((currentEscola) => ({
      ...currentEscola,
      [name]: newValue,
    }));
  };

  const handleSimNaoChange = (campo: keyof escolaInput, value: SimNaoTalvez) => {
    setNovaEscola((currentEscola) => ({
      ...currentEscola,
      [campo]: value,
    }));
  };

  return {
    novaEscola,
    handleOnChangeInput,
    inputEscolaApi,
    handleSimNaoChange,
    disabled,
  };
};
