import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { escolaInput } from "../../../shared/types/EscolaInput";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { salvarEscolaQueue } from "../../../realm/services/escolaService";
import { EsferaEnum } from "../../../enums/esfera.enum";


export const DEFAULT_ESCOLA_INPUT: escolaInput = {
  nome: "",
  iniciativa: null,
  merenda: null,
  transporte: null,
  educacaoAmbiental: null,
  localidade: {
    id: 0,
  },
};

export const useNovaEscola = (id: number) => {
  const [novaEscola, setNovaEscola] = useState<escolaInput>(DEFAULT_ESCOLA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaEscola)
    if (
      novaEscola.nome !== '' && 
      novaEscola.iniciativa != null &&
      novaEscola.merenda != null &&
      novaEscola.transporte!= null &&
      novaEscola.educacaoAmbiental != null
     
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

  const handleIniciativa = (iniciativa: EsferaEnum | "" | null) => {
    setNovaEscola((currentIniciativa) => ({
      ...currentIniciativa,
      iniciativa: iniciativa,
    }));
  };

  const handleMerenda = (merenda: SimNaoTalvez | "" | null) => {
    setNovaEscola((currentMerenda) => ({
      ...currentMerenda,
      merenda: merenda,
    }));
  };

  const handleEducAmbiental = (educaAmbiental: SimNaoTalvez | "" | null) => {
    setNovaEscola((currentEducaAbiental) => ({
      ...currentEducaAbiental,
      educacaoAmbiental: educaAmbiental,
    }));
  };


  const handleTransporte = (transporte: SimNaoTalvez | "" | null) => {
    setNovaEscola((currentTransporte) => ({
      ...currentTransporte,
      transporte: transporte,
    }));
  };



  return {
    novaEscola,
    handleOnChangeInput,
    inputEscolaApi,
    handleIniciativa,
    handleMerenda,
    handleEducAmbiental,
    handleTransporte,
    disabled,
  };
};
