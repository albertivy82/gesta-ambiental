import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { salvarPeixe, salvarPeixeQueue } from "../../../realm/services/peixesService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { PeixesType } from "../../../shared/types/PeixesType";

export const DEFAULT_PEIXES_INPUT: PeixesInput = {
  especie: '',
  climaOcorrencia:'',
  locaisEspecificosReproducao: '',
  locaisEspecificosAlimentacao: '',
  maisImportanteDaRegiao: '',  // Corrigido erro de digitação
  usosDaEspecie: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovoPeixe = (entrevistado: EntrevistadoType, peixe?: PeixesType) => {
  const [novoPeixe, setNovoPeixe] = useState<PeixesInput>(DEFAULT_PEIXES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
  
    if (
      novoPeixe.especie !== '' &&
      novoPeixe.climaOcorrencia !== '' &&
      novoPeixe.locaisEspecificosReproducao !== '' &&
      novoPeixe.locaisEspecificosAlimentacao !== '' &&
      novoPeixe.maisImportanteDaRegiao !== '' &&
      novoPeixe.usosDaEspecie !== null
    ) {
      setDisabled(false);
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

  const enviarRegistro = async () => {
    if (peixe) {
      return await enviaPeixeEdicao();
    } else {
      return await enviaPeixeNovo();
    }
  };

  const enviaPeixeNovo = async () =>{

 
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

  const enviaPeixeEdicao= async () =>{
    const peixeCorrigida = {
      ...novoPeixe,
      entrevistado: { id: typeof peixe!.entrevistado === 'number' ? peixe!.entrevistado : peixe!.entrevistado.id }
    };
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
    
     if(netInfoState.isConnected && isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/peixe/${peixe!.id}`, peixeCorrigida) as PeixesType;
              if (response && response.id) {
                return fetchPeixesAPI(response.id);
              }else{
                 const local = await salvarPeixe(buildPeixeAtualizada());
                 return local;
              }
           } catch (error) {
             //console.error("Erro ao enviar PUT:", error);
             const local = await salvarPeixe(buildPeixeAtualizada());
             Alert.alert("Erro ao enviar edição", "Tente novamente online.");
             return local;
           }
    } else {
       if (!peixe!.sincronizado && peixe!.idLocal) {
          return await salvarPeixe(buildPeixeAtualizada());
        } else {
           Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
           return null;
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

    const buildPeixeAtualizada = (): PeixesType => ({
      ...peixe!,
      ...novoPeixe,
      sincronizado: peixe?.sincronizado,
      idLocal: peixe?.idLocal,
      idFather: peixe?.idFather,
 });

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
