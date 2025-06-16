import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarAgua, salvarAguaQueue } from "../../../realm/services/aguasService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AguaInput } from "../../../shared/types/AguaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { AguaType } from "../../../shared/types/AguaType";
import { Alert } from "react-native";

export const DEFAULT_AGUA_INPUT: AguaInput = {
  tipoDeFornecimento: '',
  qualidadeDaAgua: '',
  metodoTratamento: '',
  corDagua: '',
  cheiroDagua: '',
  saborDagua: '',
  profundidadePoco: 0,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAgua = (benfeitoria: BenfeitoriaType, agua?: AguaType) => {
  const [novaAgua, setNovaAgua] = useState<AguaInput>(DEFAULT_AGUA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAgua);
    if (
      novaAgua.tipoDeFornecimento !== '' &&
      novaAgua.qualidadeDaAgua !== '' &&
      novaAgua.metodoTratamento !== '' &&
      novaAgua.corDagua !== '' &&
      novaAgua.cheiroDagua !== ''&&
      novaAgua.saborDagua !== ''
      
    ) {
      setDisabled(false);
    }
  }, [novaAgua]);

  const objetoFila = () => {
    const aguaData: AguaInput = {
      ...novaAgua,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      aguaData.benfeitoria!.id = benfeitoria.id;
      aguaData.idFather = "";
    } else if (benfeitoria.idLocal) {
      aguaData.idFather = benfeitoria.idLocal;
      aguaData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return aguaData;
  };

  const enviarRegistro = async () => {
    if (agua) {
      return await enviaAguaEdicao();
    } else {
      return await enviaAguaNova();
    }
  };

  const enviaAguaNova = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const aguasDataQueue = objetoFila();
          const aguasQueue = await salvarAguaQueue(aguasDataQueue);
          return aguasQueue;
         
  
        }else{
            novaAgua.benfeitoria = {id:benfeitoria.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/agua', novaAgua) as AguaType;
                          
                      if (response && response.id) {
                            return fetchAguaAPI(response.id);
                      }
  
                    } catch (error) {
                        const aguasDataQueue = objetoFila();
                        const aguasQueue = await salvarAguaQueue(aguasDataQueue);
                        return aguasQueue;
                       
                    }
                  }else{
                    const aguasDataQueue = objetoFila();
                    const aguasQueue = await salvarAguaQueue(aguasDataQueue);
                    return aguasQueue;
                       
                    
                  }
        }
  }

  const enviaAguaEdicao= async () =>{
    const aguaCorrigida = {
      ...novaAgua,
      benfeitoria: { id: typeof agua!.benfeitoria === 'number' ? agua!.benfeitoria : agua!.benfeitoria.id }
    };
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
    
     if(netInfoState.isConnected && isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/agua/${agua!.id}`, aguaCorrigida) as AguaType;
                    if (response && response.id) {
                      return fetchAguaAPI(response.id);
                    }else{
                      const local = await salvarAgua(buildAguaAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarAgua(buildAguaAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
          }
          
          } else {
            if (!agua!.sincronizado && agua!.idLocal) {
             return await salvarAgua(buildAguaAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
          
  }

  const buildAguaAtualizada = (): AguaType => ({
    ...agua!,
    ...novaAgua,
    sincronizado: agua?.sincronizado,
    idLocal: agua?.idLocal,
    idFather: agua?.idFather,
});
  
  
   const fetchAguaAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<AguaType>(`http://192.168.100.28:8080/agua/${id}`);
              if (response) {
                const aguaData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarAgua(aguaData);
              }else{
                      throw new Error('Dados de agua Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };
  

  const handleArrayFieldChange = (field: keyof AguaInput, values: string[]) => {
          const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
          setNovaAgua((currentState) => ({
            ...currentState,
            [field]: concatenatedValues,
          }));
        };

  const handleEnumChange = (field: keyof AguaInput, value: any) => {
          setNovaAgua((current) => ({
            ...current,
            [field]: value,
          }));
  };

  return {
    novaAgua,
    enviarRegistro,
    handleArrayFieldChange,
    handleEnumChange,
    disabled,
  };
};
