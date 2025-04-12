import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";
import { novaAve } from "../../aves/screens/Ave";
import { salvarservicosComunicacaoQueue } from "../../../realm/services/servicosComunicacaoService";


export const DEFAULT_SERVICOS_COMUNICACAO_INPUT: ServicosComunicacaoInput = {
  tipoServicoComunicacao: null,
  operadoraServicoComunicacao: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoServicoComunicacao = (benfeitoria: BenfeitoriaType) => {
  const [novoServicoComunicacao, setNovoServicoComunicacao] = useState<ServicosComunicacaoInput>(DEFAULT_SERVICOS_COMUNICACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novoServicoComunicacao);
    if (
      novoServicoComunicacao.tipoServicoComunicacao !== null &&
      novoServicoComunicacao.operadoraServicoComunicacao !== null
    ) {
      setDisabled(false);
    }
  }, [novoServicoComunicacao]);

  const objetoFila = () => {
   
  
    const servicoComunicacaoData: ServicosComunicacaoInput = {
        ...novoServicoComunicacao, 
        sincronizado: false,  
        idLocal: uuidv4(), 
    };
   
    if (benfeitoria.id>0) {
        servicoComunicacaoData.benfeitoria!.id = benfeitoria.id;
        servicoComunicacaoData.idFather = "";
      
    } else {
       if (benfeitoria.idLocal) {
           servicoComunicacaoData.idFather = benfeitoria.idLocal;
           servicoComunicacaoData.benfeitoria!.id = benfeitoria.id;
        } else {
            console.warn("ID local do imóvel não encontrado. Verifique se está sendo passado corretamente.");
        }
  
      
    }
  
    //console.log("Objeto servicoComunicacaoData final:", servicoComunicacaoData);
    return servicoComunicacaoData;
  };
  
  
  const enviarRegistro = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const servComDataQueue = objetoFila();
          const servComQueue = await salvarservicosComunicacaoQueue(servComDataQueue);
          return servComQueue;
         
  
        }else{
          novoServicoComunicacao.benfeitoria = {id:benfeitoria.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/servCom', novoServicoComunicacao) as ServicosComunicacaoType;
                          
                      if (response && response.id) {
                            return fetchMoradorAPI(response.id);
                      }
  
                    } catch (error) {
                        const servComDataQueue = objetoFila();
                        const servComQueue = await salvarservicosComunicacaoQueue(servComDataQueue);
                        return servComQueue;
                       
                    }
                  }else{
                    const servComDataQueue = objetoFila();
                    const servComQueue = await salvarservicosComunicacaoQueue(servComDataQueue);
                    return servComQueue;
                       
                    
                  }
        }
  }
  
   const fetchMoradorAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<ServicosComunicacaoType>(`http://192.168.100.28:8080/servCom/${id}`);
              if (response) {
                const servComData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarservicosComunicacaoQueue(servComData);
              }else{
                      throw new Error('Dados de servCom Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };
  
  

  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    const newValue = typeof value === 'string' ? value : value.nativeEvent.text;

    setNovoServicoComunicacao((current) => ({
      ...current,
      [name]: newValue,
    }));
  };

  const handleEnumChange = (field: keyof ServicosComunicacaoInput, value: any) => {
    setNovoServicoComunicacao((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (field: keyof ServicosComunicacaoInput, values: string[]) => {
    const concatenatedValues = values.join(', ');
    setNovoServicoComunicacao((currentState) => ({
      ...currentState,
      [field]: concatenatedValues,
    }));
  };

  return {
    novoServicoComunicacao,
    enviarRegistro,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    disabled,
  };
};
