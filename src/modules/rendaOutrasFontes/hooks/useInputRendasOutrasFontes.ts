import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarRenda, salvarRendaQueue } from "../../../realm/services/rendaOutrasFontes";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesInput } from "../../../shared/types/RendaOutrasFontesInput";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { RendaOutrasFontesType } from "../../../shared/types/RendaOutrasFontesType";


export const DEFAULT_RENDA_OUTRAS_FONTES_INPUT: RendaOutrasFontesInput = {
fonte: null,
beneficiarios: 0,
rendaMesTotal: 0, 
benfeitoria: {
    id: 0,
  },
};


export const useNovaRendaOutrasFontes = (benfeitoria: BenfeitoriaType) => {
  const [novaRendaOutrasFontes, setNovaRendaOutrasFontes] = useState<RendaOutrasFontesInput>(DEFAULT_RENDA_OUTRAS_FONTES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaRendaOutrasFontes);
    if (
      novaRendaOutrasFontes.fonte !== null &&
      novaRendaOutrasFontes.beneficiarios ==0 &&
      novaRendaOutrasFontes.rendaMesTotal ==0 

    ) {
      setDisabled(false);
    }
  }, [novaRendaOutrasFontes]);

  const objetoFila = () => {
    const rendaOutrasFontesData: RendaOutrasFontesInput = {
      ...novaRendaOutrasFontes,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      rendaOutrasFontesData.benfeitoria!.id = benfeitoria.id;
      rendaOutrasFontesData.idFather = "";
    } else if (benfeitoria.idLocal) {
      rendaOutrasFontesData.idFather = benfeitoria.idLocal;
      rendaOutrasFontesData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return rendaOutrasFontesData;
  };

  const enviarRegistro = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const rendaOutrasFontesDataQueue = objetoFila();
          const rendaOutrasFontesQueue = await salvarRendaQueue(rendaOutrasFontesDataQueue);
          return rendaOutrasFontesQueue;
         
  
        }else{
            novaRendaOutrasFontes.benfeitoria = {id:benfeitoria.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/rendaOutrasFontes', novaRendaOutrasFontes) as RendaOutrasFontesType;
                          
                      if (response && response.id) {
                            return fetchRendaOutrasFontesAPI(response.id);
                      }
  
                    } catch (error) {
                        const rendaOutrasFontesDataQueue = objetoFila();
                        const rendaOutrasFontesQueue = await salvarRendaQueue(rendaOutrasFontesDataQueue);
                        return rendaOutrasFontesQueue;
                       
                    }
                  }else{
                    const rendaOutrasFontesDataQueue = objetoFila();
                    const rendaOutrasFontesQueue = await salvarRendaQueue(rendaOutrasFontesDataQueue);
                    return rendaOutrasFontesQueue;
                       
                    
                  }
        }
  }
  
   const fetchRendaOutrasFontesAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<RendaOutrasFontesType>(`http://192.168.100.28:8080/rendaOutrasFontes/${id}`);
              if (response) {
                const rendaOutrasFontesData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarRenda(rendaOutrasFontesData);
              }else{
                      throw new Error('Dados de rendaOutrasFontes Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };
  

  const handleArrayFieldChange = (field: keyof RendaOutrasFontesInput, values: string[]) => {
             const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
             setNovaRendaOutrasFontes((currentState) => ({
               ...currentState,
               [field]: concatenatedValues,
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
        setNovaRendaOutrasFontes((current) => ({
          ...current,
          rendaMesTotal: parseFloat(formattedValue), // Salva como número para enviar à API
        }));
      };

      const handleNumberChange = (
          event: NativeSyntheticEvent<TextInputChangeEventData>, 
          field: keyof RendaOutrasFontesInput
        ) => {
          let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos
        
          setNovaRendaOutrasFontes((current) => ({
            ...current,
            [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
          }));
        };

  return {
    novaRendaOutrasFontes,
    enviarRegistro,
    handleArrayFieldChange,
    handleOnChangeRendimentoMensal,
    handleNumberChange,
    disabled,
  };
};