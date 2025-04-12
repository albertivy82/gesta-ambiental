import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AtividadeProdutivaInput } from "../../../shared/types/AtividadeProdutivaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";
import { salvarAtividade, salvarAtividadeQueue } from "../../../realm/services/atividadeProdutivaService";

export const DEFAULT_ATIVIDADE_PRODUTIVA_INPUT: AtividadeProdutivaInput = {
  atividade: null,
  pessoasEnvolvidas: 0,
  faturamentoAtividadeMesTotal: 0,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAtvProd = (benfeitoria:BenfeitoriaType)  => {
  const [novaAtividade, setNovaAtvProd] = useState<AtividadeProdutivaInput>(DEFAULT_ATIVIDADE_PRODUTIVA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAtividade);
    if (
      novaAtividade.atividade !== null &&
      novaAtividade.pessoasEnvolvidas > 0 &&
      novaAtividade.faturamentoAtividadeMesTotal > 0
    ) {
      setDisabled(false);
    }
  }, [novaAtividade]);

  const objetoFila = () => {
    const atvProdData: AtividadeProdutivaInput = {
        ...novaAtividade, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (benfeitoria.id > 0) {
        atvProdData.benfeitoria!.id = benfeitoria.id;
        atvProdData.idFather = "";
    } else if (benfeitoria.idLocal) {
        atvProdData.idFather = benfeitoria.idLocal;
        atvProdData.benfeitoria!.id = benfeitoria.id;
    } else {
        console.warn("ID local do benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return atvProdData;
  };
  

  const enviarRegistro = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const atividadeDataQueue = objetoFila();
          const atividadeQueue = await salvarAtividadeQueue(atividadeDataQueue);
          return atividadeQueue;
         
  
        }else{
          novaAtividade.benfeitoria = {id:benfeitoria.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/atividade', novaAtividade) as AtividadeProdutivaType;
                          
                      if (response && response.id) {
                            return fetchMoradorAPI(response.id);
                      }
  
                    } catch (error) {
                        const atividadeDataQueue = objetoFila();
                        const atividadeQueue = await salvarAtividadeQueue(atividadeDataQueue);
                        return atividadeQueue;
                       
                    }
                  }else{
                    const atividadeDataQueue = objetoFila();
                    const atividadeQueue = await salvarAtividadeQueue(atividadeDataQueue);
                    return atividadeQueue;
                       
                    
                  }
        }
  }
  
   const fetchMoradorAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<AtividadeProdutivaType>(`http://192.168.100.28:8080/atividade/${id}`);
              if (response) {
                const atividadeData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarAtividade(atividadeData);
              }else{
                      throw new Error('Dados de atividade Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };
  


   
  const handleEnumChange = (field: keyof AtividadeProdutivaInput, value: any) => {
    setNovaAtvProd((current) => ({
           ...current,
           [field]: value,
         }));
  };

 
  const handleNumberChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>, 
    field: keyof AtividadeProdutivaInput
  ) => {
    let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos
  
    setNovaAtvProd((current) => ({
      ...current,
      [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
    }));
  };

  const handleOnChangeRendimentoMensal = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    let value = event.nativeEvent.text;
  
    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, '');
  
    // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
    const formattedValue = (parseInt(value, 10) / 100).toFixed(2);
  
    // Atualiza o estado com o valor formatado como número
    setNovaAtvProd((current) => ({
      ...current,
      faturamentoAtividadeMesTotal: parseFloat(formattedValue), // Salva como número para enviar à API
    }));
  };


  return {
    novaAtividade,
    handleEnumChange,
    handleNumberChange,
    enviarRegistro,
    handleOnChangeRendimentoMensal,
    disabled,
};
  


}  