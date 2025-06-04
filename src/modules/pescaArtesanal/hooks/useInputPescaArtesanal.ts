import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarPescaArtesanal, salvarPescaArtesanalQueue } from "../../../realm/services/pescaService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { PescaArtesanalInput } from "../../../shared/types/PescaArtesanalInput";
import { PescaArtesanalType } from "../../../shared/types/PescaArtesanal";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export const DEFAULT_PESCA_ARTESANAL_INPUT: PescaArtesanalInput = {
  freqPescaSemanal: 0,
  horasPorDia: '',
  localDaPesca: '',
  horarioPrefencialPesca: '',
  descartePorPescaria: 0,
  conservacaoPeixe: '',
  custeio: '',
  geloPorPescaria: 0,
  custoGeloPorPescaria: 0,
  composicaoRancho: '',
  custoRanchoPorViagem: 0,
  combustivelPorViagem: 0,
  custoCombustivelPorViagem: 0,
  localDesembarque: '',
  pescaPorSafra: 0,
  localPescaSafra: '',
  localDeReproducaoPeixe: '',
  periodoDefeso: '',
  conheceDefeso: null,
  concordaDefeso: null,
  recebeDefeso: null,
  benfeitoria: {
    id: 0,
  },
};

export const useInputPescaArtesanal = (benfeitoria: BenfeitoriaType) => {
  const [novaPescaArtesanal, setNovaPescaArtesanal] = useState<PescaArtesanalInput>(DEFAULT_PESCA_ARTESANAL_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaPescaArtesanal);
    if (
      novaPescaArtesanal.freqPescaSemanal > 0 &&
      novaPescaArtesanal.horasPorDia > '' &&
      novaPescaArtesanal.localDaPesca !== '' &&
      novaPescaArtesanal.horarioPrefencialPesca !== '' &&
      novaPescaArtesanal.descartePorPescaria >= 0 &&
      novaPescaArtesanal.conservacaoPeixe !=='' &&
      novaPescaArtesanal.custeio !== '' &&
      novaPescaArtesanal.geloPorPescaria > 0 &&
      novaPescaArtesanal.custoGeloPorPescaria >= 0 &&
      novaPescaArtesanal.composicaoRancho !== '' &&
      novaPescaArtesanal.custoRanchoPorViagem >= 0 &&
      novaPescaArtesanal.combustivelPorViagem > 0 &&
      novaPescaArtesanal.custoCombustivelPorViagem >= 0 &&
      novaPescaArtesanal.localDesembarque !== '' &&
      novaPescaArtesanal.pescaPorSafra >= 0 &&
      novaPescaArtesanal.localPescaSafra !== '' &&
      novaPescaArtesanal.localDeReproducaoPeixe !== '' &&
      novaPescaArtesanal.periodoDefeso !== '' &&
      novaPescaArtesanal.conheceDefeso != null &&
      novaPescaArtesanal.concordaDefeso != null &&
      novaPescaArtesanal.recebeDefeso != null
    ) {
      setDisabled(true);
    } 
  }, [novaPescaArtesanal]);



  const objetoFila = () => {
    const pescaArtesanalData: PescaArtesanalInput = {
      ...novaPescaArtesanal,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      pescaArtesanalData.benfeitoria!.id = benfeitoria.id;
      pescaArtesanalData.idFather = "";
    } else if (benfeitoria.idLocal) {
      pescaArtesanalData.idFather = benfeitoria.idLocal;
      pescaArtesanalData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return pescaArtesanalData;
  };

  const enviarRegistro = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const pescaArtesanalDataQueue = objetoFila();
          const pescaArtesanalQueue = await salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
          return pescaArtesanalQueue;
         
  
        }else{
            novaPescaArtesanal.benfeitoria = {id:benfeitoria.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/pescaArtesanal', novaPescaArtesanal) as PescaArtesanalType;
                          
                      if (response && response.id) {
                            return fetchPescaArtesanalAPI(response.id);
                      }
  
                    } catch (error) {
                        const pescaArtesanalDataQueue = objetoFila();
                        const pescaArtesanalQueue = await salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
                        return pescaArtesanalQueue;
                       
                    }
                  }else{
                    const pescaArtesanalDataQueue = objetoFila();
                    const pescaArtesanalQueue = await salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
                    return pescaArtesanalQueue;
                       
                    
                  }
        }
  }
  
   const fetchPescaArtesanalAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<PescaArtesanalType>(`http://192.168.100.28:8080/pescaArtesanal/${id}`);
              if (response) {
                const pescaArtesanalData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarPescaArtesanal(pescaArtesanalData);
              }else{
                      throw new Error('Dados de pescaArtesanal Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };

     const handleNumberChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>, 
        field: keyof PescaArtesanalInput
      ) => {
        let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos
      
        setNovaPescaArtesanal((current) => ({
          ...current,
          [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
        }));
      };

      const handleOnChangeInput = (
        value: NativeSyntheticEvent<TextInputChangeEventData> | string,
        name: string
      ) => {
        // Verifica se "value" é um evento ou uma string diretamente
        const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
      
        setNovaPescaArtesanal((current) => ({
          ...current,
          [name]: newValue,
        }));
        };

      const handleArrayFieldChange = (field: keyof PescaArtesanalInput, values: string[]) => {
                 const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
                 setNovaPescaArtesanal((currentState) => ({
                   ...currentState,
                   [field]: concatenatedValues,
                 }));
         };

     const handleOnChangeMedidasPesca = (field: keyof PescaArtesanalInput, event: NativeSyntheticEvent<TextInputChangeEventData>) => {
          let value = event.nativeEvent.text;
        
          // Remove qualquer caractere não numérico
          value = value.replace(/\D/g, '');
        
          // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
          const formattedValue = (parseInt(value, 10) / 100).toFixed(2);
        
          // Atualiza o estado com o valor formatado como número
          setNovaPescaArtesanal((currentState) => ({
            ...currentState,
            [field]: parseFloat(formattedValue), // Salva como número para enviar à API
          }));
     };

      const handleHoraMinutoFieldChange = (
          field: keyof PescaArtesanalInput,
          hora: number | null,
          minuto: number | null
        ) => {
          if (hora === null || minuto === null) return;
        
          const horaFormatada = hora.toString().padStart(2, '0');
          const minutoFormatado = minuto.toString().padStart(2, '0');
          const horario = `${horaFormatada}:${minutoFormatado}`;
        
          setNovaPescaArtesanal((currentState) => ({
            ...currentState,
            [field]: horario,
          }));
        };

          const handleEnumChange = (field: keyof PescaArtesanalInput, value: any) => {
            setNovaPescaArtesanal((current) => ({
               ...current,
               [field]: value,
             }));
           };
        
  

  return {
    novaPescaArtesanal,
    handleNumberChange,
    handleOnChangeInput,
    handleArrayFieldChange,
    handleHoraMinutoFieldChange,
    handleOnChangeMedidasPesca,
    enviarRegistro,
    handleEnumChange,
    disabled,
  };


}