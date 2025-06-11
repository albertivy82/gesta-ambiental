import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarAve, salvarAveQueue } from "../../../realm/services/avesService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AvesInput } from "../../../shared/types/AvesInput";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { AvesType } from "../../../shared/types/AvesType";

export const DEFAULT_AVES_INPUT: AvesInput = {
  especie: '',
  climaOcorrencia: '',
  usosDaEspécie: '',
  localDeAglomeracao: '',
  problemasGerados: '',
  ameacaSofrida: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovaAves = (entrevistado:EntrevistadoType, ave?: AvesType)  => {
  const [novaAve, setNovaAve] = useState<AvesInput>(DEFAULT_AVES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAve);
    if (
      novaAve.especie !== '' &&
      novaAve.climaOcorrencia !== '' &&
      novaAve.usosDaEspécie !== '' &&
      novaAve.localDeAglomeracao !== '' &&
      novaAve.problemasGerados !== '' &&
      novaAve.ameacaSofrida !== '' 
    ) {
      setDisabled(false);
    }
  }, [novaAve]);

  const objetoFila = () => {
    const aveData: AvesInput = {
        ...novaAve, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (entrevistado.id > 0) {
        aveData.entrevistado!.id = entrevistado.id;
        aveData.idFather = "";
    } else if (entrevistado.idLocal) {
        aveData.idFather = entrevistado.idLocal;
        aveData.entrevistado!.id = entrevistado.id;
    } else {
        console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return aveData;
  };
  

  const enviarRegistro = async () => {
    if (ave) {
      return await enviaAveEdicao();
    } else {
      return await enviaAveNova();
    }
  };

  const enviaAveNova = async () =>{

 
    //entrevistado offline
        if(!entrevistado.sincronizado && entrevistado.id<=0){
          //entrevistado offline
          const avesDataQueue = objetoFila();
          const avesQueue = await salvarAveQueue(avesDataQueue);
          return avesQueue;
         
  
        }else{
            novaAve.entrevistado = {id:entrevistado.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/aves', novaAve) as AvesType;
                          
                      if (response && response.id) {
                            return fetchAvesAPI(response.id);
                      }
  
                    } catch (error) {
                        const avesDataQueue = objetoFila();
                        const avesQueue = await salvarAveQueue(avesDataQueue);
                        return avesQueue;
                       
                    }
                  }else{
                    const avesDataQueue = objetoFila();
                    const avesQueue = await salvarAveQueue(avesDataQueue);
                    return avesQueue;
                       
                    
                  }
        }
  }

  const enviaAveEdicao= async () =>{
    const aveCorrigida = {
      ...novaAve,
      entrevistado: { id: typeof ave!.entrevistado === 'number' ? ave!.entrevistado : ave!.entrevistado.id }
    };
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
    
     if(netInfoState.isConnected && isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/ave/${ave!.id}`, aveCorrigida) as AvesType;
                    if (response && response.id) {
                      return fetchAvesAPI(response.id);
                    }else{
                      const local = await salvarAve(buildAveAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarAve(buildAveAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
          }
          
          } else {
            if (!ave!.sincronizado && ave!.idLocal) {
             return await salvarAve(buildAveAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
          
  }

  const buildAveAtualizada = (): AvesType => ({
    ...ave!,
    ...novaAve,
    sincronizado: ave?.sincronizado,
    idLocal: ave?.idLocal,
    idFather: ave?.idFather,
});
  
   const fetchAvesAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<AvesType>(`http://192.168.100.28:8080/aves/${id}`);
              if (response) {
                const avesData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarAve(avesData);
              }else{
                      throw new Error('Dados de aves Inválidos'); 
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
    
      setNovaAve((current) => ({
        ...current,
        [name]: newValue,
      }));
    };

  const handleEnumChange = (field: keyof AvesInput, value: any) => {
    setNovaAve((current) => ({
           ...current,
           [field]: value,
         }));
  };

  const handleArrayFieldChange = (field: keyof AvesInput, values: string[]) => {
             const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
             setNovaAve((currentState) => ({
               ...currentState,
               [field]: concatenatedValues,
             }));
  };


  return {
    novaAve,
    enviarRegistro,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    disabled,
};
  


}  