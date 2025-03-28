import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { MoradorInput } from "../../../shared/types/MoradorInput";
import { salvarMoradorQueue } from "../../../realm/services/moradorService";
import { formatDateForApi } from "../../../shared/functions/data";

export const DEFAULT_MORADOR_INPUT: MoradorInput = {
  dataNascimento: '',
  idade: 0,
  perfil: null,
  sexo: null,
  estadoCivil: null,
  escolaridade: null,
  ondeEstuda: '',
  trabalho: null,
  religiao: '',
  doencas: '',
  benfeitoria: {
    id: 0,
  },
};

export const useNovoMorador = (benfeitoria:BenfeitoriaType)  => {
  const [novoMorador, setNovaMorador] = useState<MoradorInput>(DEFAULT_MORADOR_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  

  useEffect(() => {
    console.log(novoMorador);
    if (
      novoMorador.dataNascimento !== '' &&
      novoMorador.idade > 0 &&
      novoMorador.perfil !== '' &&
      novoMorador.sexo !== '' &&
      novoMorador.estadoCivil !== null &&
      novoMorador.escolaridade !== null &&
      novoMorador.trabalho != null &&
      novoMorador.religiao !== '' &&
      novoMorador.doencas !== ''
    ) {
      setDisabled(false);
    }
  }, [novoMorador]);

  useEffect(() => {
    if (dataNascimento) {
      const hoje = new Date();
      let anos = hoje.getFullYear() - dataNascimento.getFullYear();
      const m = hoje.getMonth() - dataNascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        anos--;
      }
  
      setNovaMorador((current) => ({
        ...current,
        idade: anos,
      }));
    }
  }, [dataNascimento]); // Agora o efeito escuta a data correta
  

  const objetoFila = () => {
    const moradorData: MoradorInput = {
        ...novoMorador, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (benfeitoria.id > 0) {
        moradorData.benfeitoria!.id = benfeitoria.id;
        moradorData.idFather = "";
    } else if (benfeitoria.idLocal) {
        moradorData.idFather = benfeitoria.idLocal;
        moradorData.benfeitoria!.id = benfeitoria.id;
    } else {
        console.warn("ID local do benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return moradorData;
  };
  

  const inputMoradorApi = async () => {
    
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
        const moradorDataQueue = objetoFila();
        console.log("useInputMorador_a", novoMorador)
        salvarMoradorQueue(moradorDataQueue);
    } else {
      novoMorador.benfeitoria = { id: benfeitoria.id };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
        console.log("useInputMorador_b", novoMorador)
  
        if (netInfoState.isConnected && isConnected) {
          console.log("useInputMorador_c", novoMorador)
            try {
                await connectionAPIPost('http://192.168.100.28:8080/morador', novoMorador);
                console.log("useInputMorador_d", novoMorador)
            } catch (error) {
                const moradorDataQueue = objetoFila();
                salvarMoradorQueue(moradorDataQueue);
                console.log("useInputMorador_e", novoMorador)
            }
        } else {
            const moradorDataQueue = objetoFila();
            salvarMoradorQueue(moradorDataQueue);
            console.log("useInputMorador_f", novoMorador)
        }
    }
  };


   const handleOnChangeInput = (
      value: NativeSyntheticEvent<TextInputChangeEventData> | string,
      name: string
    ) => {
      // Verifica se "value" é um evento ou uma string diretamente
      const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
    
      setNovaMorador((current) => ({
        ...current,
        [name]: newValue,
      }));
    };

  const handleEnumChange = (field: keyof MoradorInput, value: any) => {
    setNovaMorador((current) => ({
           ...current,
           [field]: value,
         }));
  };

  const handleArrayFieldChange = (field: keyof MoradorInput, values: string[]) => {
             const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
             setNovaMorador((currentState) => ({
               ...currentState,
               [field]: concatenatedValues,
             }));
  };

  const handleOnChangeData = (selectedDate: Date, name: string) => {
              setDataNascimento(selectedDate);
              const dataFormatada = formatDateForApi(selectedDate);
              setNovaMorador((currentUser) => ({
                  ...currentUser,
                  [name]: dataFormatada,
              }));
  };


  return {
    novoMorador,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    handleOnChangeData,
    disabled,
};
  


}  