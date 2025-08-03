import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarMorador, salvarMoradorQueue } from "../../../realm/services/moradorService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { formatDateForApi } from "../../../shared/functions/data";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { MoradorInput } from "../../../shared/types/MoradorInput";
import { MoradorType } from "../../../shared/types/MoradorType";

export const DEFAULT_MORADOR_INPUT: MoradorInput = {
  
  perfil: null,
  dataNascimento: 0,
  sexo: null,
  escolaridade: '',
  estadoCivil: null,
  ondeEstuda: '',
  trabalho: '',
  religiao: '',
  doencas: '',
  benfeitoria: {
    id: 0,
  },
};

export const useNovoMorador = (benfeitoria:BenfeitoriaType, morador?: MoradorType)  => {
  const [novoMorador, setNovaMorador] = useState<MoradorInput>(DEFAULT_MORADOR_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  

  useEffect(() => {
    console.log(novoMorador);
    if (
      novoMorador.dataNascimento <0 &&
      novoMorador.dataNascimento >120 &&
      novoMorador.perfil !== '' &&
      novoMorador.sexo !== '' &&
      novoMorador.estadoCivil !== null &&
      novoMorador.escolaridade !== '' &&
      novoMorador.trabalho != null &&
      novoMorador.religiao !== '' &&
      novoMorador.doencas !== ''
    ) {
      setDisabled(false);
    }else{
      setDisabled(true);
    }
  }, [novoMorador]);

  

  const objetoFila = () => {
    const moradorData: MoradorInput = {
        ...novoMorador, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  console.log(benfeitoria.id);
    if (benfeitoria.id > 0) {
        moradorData.benfeitoria!.id = benfeitoria.id;
        moradorData.idFather = "";
    } else if (benfeitoria.idLocal) {
        moradorData.idFather = benfeitoria.idLocal;
        moradorData.benfeitoria!.id = benfeitoria.id;
    } else {
        console.warn("ID local do benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return moradorData;
  };
  

  const enviarRegistro = async () => {
    if (morador) {
      return await enviaMoradorEdicao();
    } else {
      return await enviaMoradorNova();
    }
  };

  const enviaMoradorNova = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const moradorsDataQueue = objetoFila();
          const moradorsQueue = await salvarMoradorQueue(moradorsDataQueue);
          return moradorsQueue;
         
         
        }else{
            novoMorador.benfeitoria = {id:benfeitoria.id};
           
            const isConnected = await testConnection();
          
                  if(isConnected){
                    
                    try{
                         
                      const response = await connectionAPIPost('http://177.74.56.24/morador', novoMorador) as MoradorType;
                      console.log("vamos verificar !", response, response.id);
                      if (response && response.id) {
                        console.log("vamos verificar !", response, response.id);
                            return fetchMoradorAPI(response.id);
                      }
  
                    } catch (error) {
                        const moradorsDataQueue = objetoFila();
                        const moradorsQueue = await salvarMoradorQueue(moradorsDataQueue);
                        return moradorsQueue;
                       
                    }
                  }else{
                    const moradorsDataQueue = objetoFila();
                    const moradorsQueue = await salvarMoradorQueue(moradorsDataQueue);
                    return moradorsQueue;
                       
                    
                  }
        }
  }

  const enviaMoradorEdicao= async () =>{
    const moradorCorrigida = {
      ...novoMorador,
      benfeitoria: { id: typeof morador!.benfeitoria === 'number' ? morador!.benfeitoria : morador!.benfeitoria.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://177.74.56.24/morador/${morador!.id}`, moradorCorrigida) as MoradorType;
            
              if (response && response.id) {
                     
                      return fetchMoradorAPI(response.id);
                    }else{
                      const local = await salvarMorador(buildMoradorAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarMorador(buildMoradorAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
          }
          
          } else {
            if (!morador!.sincronizado && morador!.idLocal) {
             return await salvarMorador(buildMoradorAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
          
  }

  const buildMoradorAtualizada = (): MoradorType => ({
    ...morador!,
    ...novoMorador,
    sincronizado: morador?.sincronizado,
    idLocal: morador?.idLocal,
    idFather: morador?.idFather,
});
  
   const fetchMoradorAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<MoradorType>(`http://177.74.56.24/morador/${id}`);
              console.log("vamos verificar", response);
              if (response) {
                const moradorData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarMorador(moradorData);
              }else{
                      throw new Error('Dados de morador Inválidos'); 
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
    
      setNovaMorador((current) => ({
        ...current,
        [name]: newValue,
      }));
    };

  const handleEnumChange = (field: keyof MoradorInput, value: any) => {
    setNovaMorador((current) => ({
           ...current,
           [field]: value,
         }));
  };

  const handleArrayFieldChange = (field: keyof MoradorInput, values: string[]) => {
             const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
             setNovaMorador((currentState) => ({
               ...currentState,
               [field]: concatenatedValues,
             }));
  };

  const handleOnChangeData = (selectedDate: Date, name: string) => {
              setDataNascimento(selectedDate);
              const dataFormatada = formatDateForApi(selectedDate);
              setNovaMorador((currentUser) => ({
                  ...currentUser,
                  [name]: dataFormatada,
              }));
  };

  const handleNumberChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>, 
    field: keyof MoradorInput
  ) => {
    let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos
  
    setNovaMorador((current) => ({
      ...current,
      [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
    }));
  };

  const handleSetNumber = (value: number, field: keyof MoradorInput) => {
    setNovaMorador((current) => ({
      ...current,
      [field]: value,
    }));
  };


  return {
    novoMorador,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    handleOnChangeData,
    enviarRegistro,
    handleNumberChange,
    handleSetNumber,
    disabled,
};
  


}  