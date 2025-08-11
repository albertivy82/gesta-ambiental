import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarRenda, salvarRendaOutrasFontes, salvarRendaQueue } from "../../../realm/services/rendaOutrasFontes";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesInput } from "../../../shared/types/RendaOutrasFontesInput";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { RendaOutrasFontesType } from "../../../shared/types/RendaOutrasFontesType";


export const DEFAULT_RENDA_OUTRAS_FONTES_INPUT: RendaOutrasFontesInput = {
fonte: null,
beneficiarios: 0,
rendaMesTotal: 0, 
benfeitoria: {
    id: 0,
  },
};


export const useNovaRendaOutrasFontes = (benfeitoria: BenfeitoriaType, rendaOutrasFontes?: RendaOutrasFontesType) => {
  const [novaRendaOutrasFontes, setNovaRendaOutrasFontes] = useState<RendaOutrasFontesInput>(DEFAULT_RENDA_OUTRAS_FONTES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaRendaOutrasFontes);
    if (
      novaRendaOutrasFontes.fonte !== null &&
      novaRendaOutrasFontes.beneficiarios > 0 &&
      novaRendaOutrasFontes.rendaMesTotal >0 &&
      novaRendaOutrasFontes.rendaMesTotal <=1000000 

    ) {
      setDisabled(false);
    }else{
      setDisabled(true);
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

  const enviarRegistro = async () => {
    if (rendaOutrasFontes) {
      return await enviaRendaOutrasFontesEdicao();
    } else {
      return await enviaRendaOutrasFontesNova();
    }
  };

  const enviaRendaOutrasFontesNova = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const rendaOutrasFontessDataQueue = objetoFila();
          const rendaOutrasFontessQueue = await salvarRendaQueue(rendaOutrasFontessDataQueue);
          return rendaOutrasFontessQueue;
         
  
        }else{
            novaRendaOutrasFontes.benfeitoria = {id:benfeitoria.id};
           
            const isConnected = await testConnection();
          
                  if(isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://177.74.56.24/outras-fontes-de-renda', novaRendaOutrasFontes) as RendaOutrasFontesType;
                          
                      if (response && response.id) {
                            return fetchRendaOutrasFontesAPI(response.id);
                      }
  
                    } catch (error) {
                        const rendaOutrasFontessDataQueue = objetoFila();
                        const rendaOutrasFontessQueue = await salvarRendaQueue(rendaOutrasFontessDataQueue);
                        return rendaOutrasFontessQueue;
                       
                    }
                  }else{
                    const rendaOutrasFontessDataQueue = objetoFila();
                    const rendaOutrasFontessQueue = await salvarRendaQueue(rendaOutrasFontessDataQueue);
                    return rendaOutrasFontessQueue;
                       
                    
                  }
        }
  }

  const enviaRendaOutrasFontesEdicao= async () =>{
    const rendaOutrasFontesCorrigida = {
      ...novaRendaOutrasFontes,
      benfeitoria: { id: typeof rendaOutrasFontes!.benfeitoria === 'number' ? rendaOutrasFontes!.benfeitoria : rendaOutrasFontes!.benfeitoria.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://177.74.56.24/outras-fontes-de-renda/${rendaOutrasFontes!.id}`, rendaOutrasFontesCorrigida) as RendaOutrasFontesType;
                    if (response && response.id) {
                      return fetchRendaOutrasFontesAPI(response.id);
                    }else{
                      const local = await salvarRenda(buildRendaOutrasFontesAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarRenda(buildRendaOutrasFontesAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
          }
          
          } else {
            if (!rendaOutrasFontes!.sincronizado && rendaOutrasFontes!.idLocal) {
             return await salvarRenda(buildRendaOutrasFontesAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
          
  }

  const buildRendaOutrasFontesAtualizada = (): RendaOutrasFontesType => ({
    ...rendaOutrasFontes!,
    ...novaRendaOutrasFontes,
    sincronizado: rendaOutrasFontes?.sincronizado,
    idLocal: rendaOutrasFontes?.idLocal,
    idFather: rendaOutrasFontes?.idFather,
});
  
   const fetchRendaOutrasFontesAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<RendaOutrasFontesType>(`http://177.74.56.24/outras-fontes-de-renda/${id}`);
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
  
        // Remove tudo que não for número
        value = value.replace(/\D/g, '');
      
        // Formata como string com 2 casas decimais
        const formattedValue = (parseInt(value || '0', 10) / 100).toFixed(2);
        setNovaRendaOutrasFontes((current) => ({
          ...current,
          rendaMesTotal:parseFloat(formattedValue), // Salva como número para enviar à API
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