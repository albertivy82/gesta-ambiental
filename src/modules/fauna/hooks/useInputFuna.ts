import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FaunaInput } from "../../../shared/types/FaunaInput";
import { salvarFauna, salvarFaunaQueue } from "../../../realm/services/faunaService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { FaunaType } from "../../../shared/types/FaunaType";

export const DEFAULT_FAUNA_INPUT: FaunaInput = {
  especie: '',
  ocorreMata: null,
  ocorreRio: null,
  ocorreLago: null,
  ocorreRua: null,
  ocorreQuintal: null,
  outrasOcorrencias: null,
  frequenciaAtual: '',
  frequenciaPassada: '',
  tempoQueNaoVe: null,
  entrevistado: {
    id: 0,
  },
};

export const useNovaFauna = (entrevistado: EntrevistadoType, fauna?: FaunaType) => {
  const [novaFauna, setNovaFauna] = useState<FaunaInput>(DEFAULT_FAUNA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaFauna);
    if (
      novaFauna.especie !== '' &&
      novaFauna.ocorreMata !== null &&
      novaFauna.ocorreRio !== null &&
      novaFauna.ocorreLago !== null &&
      novaFauna.ocorreRua !== null &&
      novaFauna.ocorreQuintal !== null &&
      novaFauna.outrasOcorrencias !== null &&
      novaFauna.frequenciaAtual !== '' &&
      novaFauna.frequenciaPassada !== null &&
      novaFauna.tempoQueNaoVe !== null
    ) 
      setDisabled(true);
    
  }, [novaFauna]);

  const objetoFila = () => {
    const faunaData: FaunaInput = {
      ...novaFauna,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (entrevistado.id > 0) {
      faunaData.entrevistado!.id = entrevistado.id;
      faunaData.idFather = "";
    } else if (entrevistado.idLocal) {
      faunaData.idFather = entrevistado.idLocal;
      faunaData.entrevistado!.id = entrevistado.id;
    } else {
      console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }

    return faunaData;
  };

  const enviarRegistro = async () => {
    if (fauna) {
      return await enviaFaunaEdicao();
    } else {
      return await enviaFaunaNova();
    }
  };

  const enviaFaunaNova = async () =>{

 
    //entrevistado offline
        if(!entrevistado.sincronizado && entrevistado.id<=0){
          //entrevistado offline
          const faunaDataQueue = objetoFila();
          const faunaQueue = await salvarFaunaQueue(faunaDataQueue);
          return faunaQueue;
         
  
        }else{
            novaFauna.entrevistado = {id:entrevistado.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/fauna', novaFauna) as FaunaType;
                          
                      if (response && response.id) {
                            return fetchFaunaAPI(response.id);
                      }
  
                    } catch (error) {
                        const faunaDataQueue = objetoFila();
                        const faunaQueue = await salvarFaunaQueue(faunaDataQueue);
                        return faunaQueue;
                       
                    }
                  }else{
                    const faunaDataQueue = objetoFila();
                    const faunaQueue = await salvarFaunaQueue(faunaDataQueue);
                    return faunaQueue;
                       
                    
                  }
        }
  }

  const enviaFaunaEdicao= async () =>{
    const faunaCorrigida = {
      ...novaFauna,
      entrevistado: { id: typeof fauna!.entrevistado === 'number' ? fauna!.entrevistado : fauna!.entrevistado.id }
    };
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
    
     if(netInfoState.isConnected && isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/fauna/${fauna!.id}`, faunaCorrigida) as FaunaType;
              if (response && response.id) {
                return fetchFaunaAPI(response.id);
              }
              } catch (error) {
                
                Alert.alert(
                  "Erro ao editar",
                  "Não foi possível salvar as alterações. Tente novamente quando estiver online."
                );
                return null;
               
            }
          
          } else {
            if (!fauna!.sincronizado && fauna!.idLocal) {
             
              //Objeto ainda não sincronizado → atualizar no Realm
              const faunaAtualizado: FaunaType = {
                ...fauna!,
                especie: novaFauna.especie,
                ocorreMata: novaFauna.ocorreMata,
                ocorreRio: novaFauna.ocorreRio,
                ocorreLago: novaFauna.ocorreLago,
                ocorreRua: novaFauna.ocorreRua,
                ocorreQuintal: novaFauna.ocorreQuintal,
                outrasOcorrencias: novaFauna.outrasOcorrencias,
                frequenciaAtual: novaFauna.frequenciaAtual,
                frequenciaPassada: novaFauna.frequenciaPassada,
                tempoQueNaoVe: novaFauna.tempoQueNaoVe !== null ? novaFauna.tempoQueNaoVe : '',
              };
              
              const faunaQueue = await salvarFauna(faunaAtualizado);
              return faunaQueue;
            } else {
              // Objeto sincronizado → não permitir edição offline
              Alert.alert(
                "Sem conexão",
                "Este registro já foi sincronizado. Para editá-lo, conecte-se à internet."
              );
              return null;
            }
          }
          
  }
  
   const fetchFaunaAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<FaunaType>(`http://192.168.100.28:8080/fauna/${id}`);
              if (response) {
                const faunaData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarFauna(faunaData);
              }else{
                      throw new Error('Dados de fauna Inválidos'); 
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
      
        setNovaFauna((current) => ({
          ...current,
          [name]: newValue,
        }));
      };
  
    const handleEnumChange = (field: keyof FaunaInput, value: any) => {
      setNovaFauna((current) => ({
             ...current,
             [field]: value,
           }));
    };

    const handleArrayFieldChange = (field: keyof FaunaInput, values: string[]) => {
                 const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
                 setNovaFauna((currentState) => ({
                   ...currentState,
                   [field]: concatenatedValues,
                 }));
  };
  
   
  
    return {
      novaFauna,
      enviarRegistro,
      handleOnChangeInput,
      handleEnumChange,  
      handleArrayFieldChange,   
      disabled,
  };
};
