import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MamiferosInput } from "../../../shared/types/MamiferosInput";
import { salvarMamiferoQueue } from "../../../realm/services/mamiferosService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export const DEFAULT_MAMIFEROS_INPUT: MamiferosInput = {
  
  especie: '',
  usoConsumo: null,
  usoComercio: null,
  usoCriacao: null,
  usoRemedio: null,
  usoOutros: null,
  problemasRelacionados: '',
  alimentacao: '',
  desricaoEspontanea: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovoMamifero = (entrevistado:EntrevistadoType) => {
  const [novoMamifero, setNovoMamifero] = useState<MamiferosInput>(DEFAULT_MAMIFEROS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novoMamifero);
    if (
      novoMamifero.especie !== '' &&
      novoMamifero.usoConsumo !== null &&
      novoMamifero.usoComercio !== null &&
      novoMamifero.usoCriacao !== null &&
      novoMamifero.usoRemedio !== null &&
      novoMamifero.usoOutros !== null &&
      novoMamifero.problemasRelacionados !== '' &&
      novoMamifero.alimentacao !== '' &&
      novoMamifero.desricaoEspontanea !== ''
    ) {
      setDisabled(false);
    } 
  }, [novoMamifero]);

  const objetoFila = () => {
    const mamiferoData: MamiferosInput = {
        ...novoMamifero, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (entrevistado.id > 0) {
        mamiferoData.entrevistado!.id = entrevistado.id;
        mamiferoData.idFather = "";
    } else if (entrevistado.idLocal) {
        mamiferoData.idFather = entrevistado.idLocal;
        mamiferoData.entrevistado!.id = entrevistado.id;
    } else {
        console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return mamiferoData;
  };
  

  const inputMamiferoApi = async () => {
    
    if (!entrevistado.sincronizado && entrevistado.id <= 0) {
        const mamiferoDataQueue = objetoFila();
        console.log("useInputMamifero_a", novoMamifero)
        salvarMamiferoQueue(mamiferoDataQueue);
    } else {
        novoMamifero.entrevistado = { id: entrevistado.id };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
        console.log("useInputMamifero_b", novoMamifero)
  
        if (netInfoState.isConnected && isConnected) {
          console.log("useInputMamifero_c", novoMamifero)
            try {
                await connectionAPIPost('http://192.168.100.28:8080/mamifero', novoMamifero);
                console.log("useInputMamifero_d", novoMamifero)
            } catch (error) {
                const mamiferoDataQueue = objetoFila();
                salvarMamiferoQueue(mamiferoDataQueue);
                console.log("useInputMamifero_e", novoMamifero)
            }
        } else {
            const mamiferoDataQueue = objetoFila();
            salvarMamiferoQueue(mamiferoDataQueue);
            console.log("useInputMamifero_f", novoMamifero)
        }
    }
  };
  
  const handleOnChangeInput = (
        value: NativeSyntheticEvent<TextInputChangeEventData> | string,
        name: string
      ) => {
        // Verifica se "value" é um evento ou uma string diretamente
        const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
      
        setNovoMamifero((current) => ({
          ...current,
          [name]: newValue,
        }));
      };
  
    const handleEnumChange = (field: keyof MamiferosInput, value: any) => {
      setNovoMamifero((current) => ({
             ...current,
             [field]: value,
           }));
    };
  
    const handleArrayFieldChange = (field: keyof MamiferosInput, values: string[]) => {
               const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
               setNovoMamifero((currentState) => ({
                 ...currentState,
                 [field]: concatenatedValues,
               }));
    };
  
  
    return {
      novoMamifero,
      handleOnChangeInput,
      handleEnumChange,
      handleArrayFieldChange,
      disabled,
  };


}