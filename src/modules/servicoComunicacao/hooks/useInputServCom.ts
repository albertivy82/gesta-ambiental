import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarservicosComunicacao, salvarservicosComunicacaoQueue } from "../../../realm/services/servicosComunicacaoService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";



export const DEFAULT_SERVICOS_COMUNICACAO_INPUT: ServicosComunicacaoInput = {
  tipoServicoComunicacao: null,
  operadoraServicoComunicacao: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoServicoComunicacao = (benfeitoria: BenfeitoriaType, servicoComunicacao?: ServicosComunicacaoType) => {
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
  
  
  const enviarRegistro = async () => {
    if (servicoComunicacao) {
      return await enviaServicoComunicacaoEdicao();
    } else {
      return await enviaServicoComunicacaoNova();
    }
  };

  const enviaServicoComunicacaoNova = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const servicoComunicacaosDataQueue = objetoFila();
          const servicoComunicacaosQueue = await salvarservicosComunicacaoQueue(servicoComunicacaosDataQueue);
          return servicoComunicacaosQueue;
         
  
        }else{
            novoServicoComunicacao.benfeitoria = {id:benfeitoria.id};
           
            const isConnected = await testConnection();
          
                  if(isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://177.74.56.24/servico-de-comunicacao', novoServicoComunicacao) as ServicosComunicacaoType;
                          
                      if (response && response.id) {
                            return fetchServicoComunicacaoAPI(response.id);
                      }
  
                    } catch (error) {
                        const servicoComunicacaosDataQueue = objetoFila();
                        const servicoComunicacaosQueue = await salvarservicosComunicacaoQueue(servicoComunicacaosDataQueue);
                        return servicoComunicacaosQueue;
                       
                    }
                  }else{
                    const servicoComunicacaosDataQueue = objetoFila();
                    const servicoComunicacaosQueue = await salvarservicosComunicacaoQueue(servicoComunicacaosDataQueue);
                    return servicoComunicacaosQueue;
                       
                    
                  }
        }
  }

  const enviaServicoComunicacaoEdicao= async () =>{
    const servicoComunicacaoCorrigida = {
      ...novoServicoComunicacao,
      benfeitoria: { id: typeof servicoComunicacao!.benfeitoria === 'number' ? servicoComunicacao!.benfeitoria : servicoComunicacao!.benfeitoria.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://177.74.56.24/servico-de-comunicacao/benfeitoria-servico-de-comunicacao/${servicoComunicacao!.id}`, servicoComunicacaoCorrigida) as ServicosComunicacaoType;
                    if (response && response.id) {
                      return fetchServicoComunicacaoAPI(response.id);
                    }else{
                      const local = await salvarservicosComunicacao(buildServicoComunicacaoAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarservicosComunicacao(buildServicoComunicacaoAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
          }
          
          } else {
            if (!servicoComunicacao!.sincronizado && servicoComunicacao!.idLocal) {
             return await salvarservicosComunicacao(buildServicoComunicacaoAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
          
  }

  const buildServicoComunicacaoAtualizada = (): ServicosComunicacaoType => ({
    ...servicoComunicacao!,
    ...novoServicoComunicacao,
    sincronizado: servicoComunicacao?.sincronizado,
    idLocal: servicoComunicacao?.idLocal,
    idFather: servicoComunicacao?.idFather,
});
  
   const fetchServicoComunicacaoAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<ServicosComunicacaoType>(`http://177.74.56.24/servico-de-comunicacao/${id}`);
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
