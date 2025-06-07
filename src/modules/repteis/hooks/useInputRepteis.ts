import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { RepteisType } from "../../../shared/types/RepteisType";
import { salvarReptil, salvarReptilQueue } from "../../../realm/services/repteisService";

export const DEFAULT_REPTEIS_INPUT: RepteisType = {
  id: 0,
  especie: '',
  local: '',
  periodo: '',
  uso: '',
  ameacado: '',
  problemasRelacionados: '',
  cacado: '',
  descricaoEspontanea: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovoReptil = (entrevistado: EntrevistadoType, reptil?: RepteisType) => {
  const [novoReptil, setNovoReptil] = useState<RepteisType>(DEFAULT_REPTEIS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoReptil);
    if (
      novoReptil.especie !== '' &&
      novoReptil.local !== '' &&
      novoReptil.periodo !== '' &&
      novoReptil.uso !== '' &&
      novoReptil.ameacado !== '' &&
      novoReptil.problemasRelacionados !== '' &&
      novoReptil.cacado !== '' &&
      novoReptil.descricaoEspontanea !== ''
    ) {
      setDisabled(true);
    
    }
  }, [novoReptil]);

  const objetoFila = () => {
    const reptilData: RepteisType = {
      ...novoReptil,
      id: 0,  // ID será gerado pelo backend após sincronização
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
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/repteis', novoReptil) as RepteisType;
                          
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
              }
              } catch (error) {
                
                Alert.alert(
                  "Erro ao editar",
                  "Não foi possível salvar as alterações. Tente novamente quando estiver online."
                );
                return null;
               
            }
          
          } else {
            if (!reptil!.sincronizado && reptil!.idLocal) {
             
              //Objeto ainda não sincronizado → atualizar no Realm
              const reptilAtualizado: RepteisType = {
                ...reptil!,
                especie: novoReptil.especie,
                local: novoReptil.local,
                periodo: novoReptil.periodo,
                uso: novoReptil.uso,
                ameacado: novoReptil.ameacado,
                problemasRelacionados: novoReptil.problemasRelacionados,
                cacado: novoReptil.cacado,
                descricaoEspontanea: novoReptil.descricaoEspontanea
              };
              
              const reptilQueue = await salvarReptil(reptilAtualizado);
              return reptilQueue;
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
  
   const fetchRepteisAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<RepteisType>(`http://192.168.100.28:8080/repteis/${id}`);
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
  
    
  
  
    return {
      novoReptil,
      enviarRegistro,
      handleOnChangeInput,
      disabled,
  };
};
