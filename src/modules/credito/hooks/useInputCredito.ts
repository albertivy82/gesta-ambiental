import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarCredito, salvarCreditoQueue } from "../../../realm/services/creditoService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { CreditoInput } from "../../../shared/types/CreditoInput";
import { CreditoType } from "../../../shared/types/CreditoType";

export const DEFAULT_CREDITO_INPUT: CreditoInput = {
  nome: '',
  valor: 0,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoCredito = (benfeitoria: BenfeitoriaType, credito?: CreditoType) => {
  const [novoCredito, setNovoCredito] = useState<CreditoInput>(DEFAULT_CREDITO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novoCredito);
    if (
      novoCredito.nome !== '' &&
      novoCredito.valor > 0 &&
      novoCredito.valor <= 1000000
    ) {
      setDisabled(false);
    }else{
      setDisabled(true);
    }
  }, [novoCredito]);

  const objetoFila = () => {
    const creditoData: CreditoInput = {
      ...novoCredito,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      creditoData.benfeitoria!.id = benfeitoria.id;
      creditoData.idFather = "";
    } else if (benfeitoria.idLocal) {
      creditoData.idFather = benfeitoria.idLocal;
      creditoData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return creditoData;
  };

  const enviarRegistro = async () => {
    if (credito) {
      return await enviaCreditoEdicao();
    } else {
      return await enviaCreditoNova();
    }
  };

  const enviaCreditoNova = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const creditosDataQueue = objetoFila();
          const creditosQueue = await salvarCreditoQueue(creditosDataQueue);
          return creditosQueue;
         
  
        }else{
            novoCredito.benfeitoria = {id:benfeitoria.id};
           
            const isConnected = await testConnection();
          
                  if(isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/credito', novoCredito) as CreditoType;
                          
                      if (response && response.id) {
                            return fetchCreditoAPI(response.id);
                      }
  
                    } catch (error) {
                        const creditosDataQueue = objetoFila();
                        const creditosQueue = await salvarCreditoQueue(creditosDataQueue);
                        return creditosQueue;
                       
                    }
                  }else{
                    const creditosDataQueue = objetoFila();
                    const creditosQueue = await salvarCreditoQueue(creditosDataQueue);
                    return creditosQueue;
                       
                    
                  }
        }
  }

  const enviaCreditoEdicao= async () =>{

    const testConnectionOne = await testConnection();
        
        if(!credito?.sincronizado && !testConnectionOne){
               
                Alert.alert("Registro Apenas Local");
                const local = await salvarCredito(buildCreditoAtualizada());
                 return local;
        
        }else{
    const creditoCorrigida = {
      ...novoCredito,
      benfeitoria: { id: typeof credito!.benfeitoria === 'number' ? credito!.benfeitoria : credito!.benfeitoria.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/credito/${credito!.id}`, creditoCorrigida) as CreditoType;
                    if (response && response.id) {
                      return fetchCreditoAPI(response.id);
                    }else{
                      const local = await salvarCredito(buildCreditoAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarCredito(buildCreditoAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novomente online.");
              return local;
          }
          
          } else {
            if (!credito!.sincronizado && credito!.idLocal) {
             return await salvarCredito(buildCreditoAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
        }
          
  }

  const buildCreditoAtualizada = (): CreditoType => ({
    ...credito!,
    ...novoCredito,
    benfeitoria: { id: typeof credito!.benfeitoria === 'number' ? credito!.benfeitoria : credito!.benfeitoria.id },
    sincronizado: credito?.sincronizado,
    idLocal: credito?.idLocal,
    idFather: credito?.idFather,
});
  
   const fetchCreditoAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<CreditoType>(`http://192.168.100.28:8080/credito/${id}`);
              if (response) {
                const creditoData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarCredito(creditoData);
              }else{
                      throw new Error('Dados de credito Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
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
          setNovoCredito((current) => ({
            ...current,
            valor:parseFloat(formattedValue), // Salva como número para enviar à API
          }));
  };

  
  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    // Verifica se "value" é um evento ou uma string diretamente
    const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
  
    setNovoCredito((current) => ({
      ...current,
      [name]: newValue,
    }));
  };


  return {
    novoCredito,
    enviarRegistro,
    handleOnChangeRendimentoMensal,
    handleOnChangeInput,
    disabled,
  };
};
