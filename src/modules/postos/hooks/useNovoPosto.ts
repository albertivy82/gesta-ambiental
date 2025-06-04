import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { SimNao } from "../../../enums/simNao.enum";
import { salvarPosto, salvarPostoSaudeQueue } from "../../../realm/services/postoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { postoSaudeInput } from "../../../shared/types/postoSaudeInput";
import { PostoType } from "../../../shared/types/postoTypes";

export const DEFAULT_POSTO_INPUT: postoSaudeInput = {
  nome: "",
  ambulatorial: null,
  urgenciaEmergencia: null,
  medicosPorTurno: 0,
  localidade: {
    id: 0,
  },
};

export const useNovoPosto = (localidadeId: number) => {
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
        localidade: { id: localidadeId },
        sincronizado: false,  
        idLocal: uuidv4(),
    };
  
    return postoData;
  };


  const enviarRegistro = async () =>{

    novoPosto.localidade = {id:localidadeId};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/posto-de-saude', novoPosto) as PostoType;
                          
                      if (response && response.id) {
                            return fetchPostoAPI(response.id);
                      }
  
                    } catch (error) {
                        const postoDataQueue = objetoFila();
                        const postoQueue = await salvarPostoSaudeQueue(postoDataQueue);
                        return postoQueue;
                       
                    }
                  }else{
                    const postoDataQueue = objetoFila();
                    const postoQueue = await salvarPostoSaudeQueue(postoDataQueue);
                    return postoQueue;
                  }
  }
  
   const fetchPostoAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<PostoType>(`http://192.168.100.28:8080/posto-de-saude/${id}`);
              if (response) {
                const postoData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
              };
                   return await salvarPosto(postoData);
              }else{
                      throw new Error('Dados de posto Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
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

  const handleAmbulatorialChange = (ambulatorial: SimNao | "" | null) => {
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      ambulatorial: ambulatorial,
    }));
  };

  const handleUrgenciaEmergenciaChange = (urgenciaEmergencia: SimNao | "" | null) => {
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      urgenciaEmergencia: urgenciaEmergencia,
    }));
  };

  
  const handleMedicosPorTurnoChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    let value = event.nativeEvent.text;
  
    value = value.replace(/\D/g, '');
  
    // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
    const formattedValue = parseInt(value, 10);
  
    // Atualiza o estado com o valor formatado como número
    setNovoPosto((currentPosto) => ({
      ...currentPosto,
      medicosPorTurno: formattedValue, // Salva como número para enviar à API
    }));
  };

  return {
    novoPosto,
    enviarRegistro,
    handleOnChangeInput,
    handleAmbulatorialChange,
    handleUrgenciaEmergenciaChange,
    handleMedicosPorTurnoChange,
    disabled,
  };
};
