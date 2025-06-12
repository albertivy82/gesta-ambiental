import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { RepteisType } from "../../../shared/types/RepteisType";
import { salvarReptil, salvarReptilQueue } from "../../../realm/services/repteisService";
import { RepteisInput } from "../../../shared/types/RepteisInput";

export const DEFAULT_REPTEIS_INPUT: RepteisInput = {
  especie: '',
  local: '',
  desova: '',
  localDesova: '',
  periodoDesova: '',
  usoDaEspecie: '',
  ameacaParaEspecie: '',
  problemasGerados: '',
  descricaoEspontanea: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovoReptil = (entrevistado: EntrevistadoType, reptil?: RepteisType) => {
  const [novoReptil, setNovoReptil] = useState<RepteisInput>(DEFAULT_REPTEIS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    
    if (
      novoReptil.especie !== '' &&
      novoReptil.local !== '' &&
      novoReptil.desova !== '' &&
      novoReptil.usoDaEspecie !== '' &&
      novoReptil.ameacaParaEspecie !== '' &&
      novoReptil.problemasGerados !== ''
    ) {
      setDisabled(false);
    
    }
  }, [novoReptil]);

  const objetoFila = () => {
    const reptilData: RepteisInput = {
      ...novoReptil,
      idLocal: uuidv4(),
      sincronizado: false,
    };

    if (entrevistado.id > 0) {
      reptilData.entrevistado!.id = entrevistado.id;
      reptilData.idFather = "";
    } else if (entrevistado.idLocal) {
      reptilData.idFather = entrevistado.idLocal;
      reptilData.entrevistado!.id = entrevistado.id;
    } else {
      console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }

    return reptilData;
  };

  const enviarRegistro = async () => {
    if (reptil) {
      return await enviaReptilEdicao();
    } else {
      return await enviaReptilNovo();
    }
  };

  const enviaReptilNovo = async () =>{

 
    //entrevistado offline
        if(!entrevistado.sincronizado && entrevistado.id<=0){
          //entrevistado offline
          const repteisDataQueue = objetoFila();
          const repteisQueue = await salvarReptilQueue(repteisDataQueue);
          return repteisQueue;
         
  
        }else{
            novoReptil.entrevistado = {id:entrevistado.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/reptil', novoReptil) as RepteisType;
                          
                      if (response && response.id) {
                            return fetchRepteisAPI(response.id);
                      }
  
                    } catch (error) {
                        const repteisDataQueue = objetoFila();
                        const repteisQueue = await salvarReptilQueue(repteisDataQueue);
                        return repteisQueue;
                       
                    }
                  }else{
                    const repteisDataQueue = objetoFila();
                    const repteisQueue = await salvarReptilQueue(repteisDataQueue);
                    return repteisQueue;
                       
                    
                  }
        }
  }

  const enviaReptilEdicao= async () =>{
    const reptilCorrigida = {
      ...novoReptil,
      entrevistado: { id: typeof reptil!.entrevistado === 'number' ? reptil!.entrevistado : reptil!.entrevistado.id }
    };
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
    
     if(netInfoState.isConnected && isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/reptil/${reptil!.id}`, reptilCorrigida) as RepteisType;
              if (response && response.id) {
                  return fetchRepteisAPI(response.id);
              }else{
                const local = await salvarReptil(buildReptilAtualizada());
               return local;
              }
            } catch (error) {
                //console.error("Erro ao enviar PUT:", error);
                const local = await await salvarReptil(buildReptilAtualizada());
                Alert.alert("Erro ao enviar edição", "Tente novamente online.");
                return local;
           }
                          
    } else {
         if (!reptil!.sincronizado && reptil!.idLocal) {
              return await await salvarReptil(buildReptilAtualizada());
         } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
          }
    }
                          
   }

  const buildReptilAtualizada = (): RepteisType => ({
    ...reptil!,
    ...novoReptil,
    sincronizado: reptil?.sincronizado,
    idLocal: reptil?.idLocal,
    idFather: reptil?.idFather,
});
  
   const fetchRepteisAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<RepteisType>(`http://192.168.100.28:8080/reptil/${id}`);
              if (response) {
                const repteisData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarReptil(repteisData);
              }else{
                      throw new Error('Dados de repteis Inválidos'); 
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
      
        setNovoReptil((current) => ({
          ...current,
          [name]: newValue,
        }));
      };

   const handleEnumChange = (field: keyof RepteisInput, value: any) => {
        setNovoReptil((current) => ({
          ...current,
          [field]: value,
        }));
      };
  
    
  
  
    return {
      novoReptil,
      enviarRegistro,
      handleEnumChange,
      handleOnChangeInput,
      disabled,
  };
};
