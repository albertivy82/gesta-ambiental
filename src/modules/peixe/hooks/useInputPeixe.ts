import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { salvarPeixe, salvarPeixeQueue } from "../../../realm/services/peixesService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { PeixesType } from "../../../shared/types/PeixesType";

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

  const enviarRegistro = async () =>{

 
    //entrevistado offline
        if(!entrevistado.sincronizado && entrevistado.id<=0){
          //entrevistado offline
          const peixeDataQueue = objetoFila();
          const peixeQueue = await salvarPeixeQueue(peixeDataQueue);
          return peixeQueue;
         
  
        }else{
            novoPeixe.entrevistado = {id:entrevistado.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/peixe', novoPeixe) as PeixesType;
                          
                      if (response && response.id) {
                            return fetchPeixesAPI(response.id);
                      }
  
                    } catch (error) {
                        const peixeDataQueue = objetoFila();
                        const peixeQueue = await salvarPeixeQueue(peixeDataQueue);
                        return peixeQueue;
                       
                    }
                  }else{
                    const peixeDataQueue = objetoFila();
                    const peixeQueue = await salvarPeixeQueue(peixeDataQueue);
                    return peixeQueue;
                       
                    
                  }
        }
  }
  
   const fetchPeixesAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<PeixesType>(`http://192.168.100.28:8080/peixe/${id}`);
              if (response) {
                const peixeData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarPeixe(peixeData);
              }else{
                      throw new Error('Dados de peixe Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
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
      enviarRegistro,
      handleOnChangeInput,
      handleEnumChange,
      disabled,
  };
};
