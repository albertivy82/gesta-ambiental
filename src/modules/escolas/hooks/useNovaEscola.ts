import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { escolaInput } from "../../../shared/types/EscolaInput";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { salvarEscola, salvarEscolaQueue } from "../../../realm/services/escolaService";
import { EsferaEnum } from "../../../enums/esfera.enum";
import { EscolaType } from "../../../shared/types/EscolaType";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { SimNao } from "../../../enums/simNao.enum";


export const DEFAULT_ESCOLA_INPUT: escolaInput = {
  nome: '',
  iniciativa: null,
  merenda: null,
  transporte: null,
  educacaoAmbiental: null,
  localidade: {
    id: 0,
  },
};

export const useNovaEscola = (localidadeId: number) => {
  const [novaEscola, setNovaEscola] = useState<escolaInput>(DEFAULT_ESCOLA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    
    if (
      novaEscola.nome !== '' && 
      novaEscola.iniciativa != null &&
      novaEscola.merenda != null &&
      novaEscola.transporte!= null &&
      novaEscola.educacaoAmbiental != null
     
    ) {
      setDisabled(false);
    }
  }, [novaEscola]);

  const objetoFila = () => {
    const escolaData: escolaInput = {
        ...novaEscola, 
        localidade: { id: localidadeId},
        sincronizado: false,  
        idLocal: uuidv4(),
    };
  
    return escolaData;
  };


  const enviarRegistro = async () =>{

    novaEscola.localidade = {id:localidadeId};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/escola', novaEscola) as EscolaType;
                          
                      if (response && response.id) {
                            return fetchEscolaAPI(response.id);
                      }
  
                    } catch (error) {
                        const escolaDataQueue = objetoFila();
                        const escolaQueue = await salvarEscolaQueue(escolaDataQueue);
                        return escolaQueue;
                       
                    }
                  }else{
                    const escolaDataQueue = objetoFila();
                    const escolaQueue = await salvarEscolaQueue(escolaDataQueue);
                    return escolaQueue;
                  }
  }
  
   const fetchEscolaAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<EscolaType>(`http://192.168.100.28:8080/escola/${id}`);
              if (response) {
                const escolaData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
              };
                   return await salvarEscola(escolaData);
              }else{
                      throw new Error('Dados de escola Inválidos'); 
                  }
          } catch (error) {
                  //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };

  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    const newValue = typeof value === "string" ? value : value.nativeEvent.text;

    setNovaEscola((currentEscola) => ({
      ...currentEscola,
      [name]: newValue,
    }));
  };

  const handleIniciativa = (iniciativa: EsferaEnum | "" | null) => {
    setNovaEscola((currentIniciativa) => ({
      ...currentIniciativa,
      iniciativa: iniciativa,
    }));
  };

  const handleMerenda = (merenda: SimNao | "" | null) => {
    setNovaEscola((currentMerenda) => ({
      ...currentMerenda,
      merenda: merenda,
    }));
  };

  const handleEducAmbiental = (educaAmbiental: SimNao | "" | null) => {
    setNovaEscola((currentEducaAbiental) => ({
      ...currentEducaAbiental,
      educacaoAmbiental: educaAmbiental,
    }));
  };


  const handleTransporte = (transporte: SimNao | "" | null) => {
    setNovaEscola((currentTransporte) => ({
      ...currentTransporte,
      transporte: transporte,
    }));
  };



  return {
    novaEscola,
    handleOnChangeInput,
    enviarRegistro,
    handleIniciativa,
    handleMerenda,
    handleEducAmbiental,
    handleTransporte,
    disabled,
  };
};
