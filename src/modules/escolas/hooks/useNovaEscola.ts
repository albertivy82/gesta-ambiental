import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { escolaInput } from "../../../shared/types/EscolaInput";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
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

export const useNovaEscola = (localidadeId: number, escola?: EscolaType) => {
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
    }else{
      setDisabled(true);
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


  const enviarRegistro = async () => {
    if (escola) {
      return await enviaEscolaEdicao();
    } else {
      return await enviaEscolaNova();
    }
  };


  const enviaEscolaNova = async () =>{

    novaEscola.localidade = {id:localidadeId};
           
            const isConnected = await testConnection();
          
                  if(isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://177.74.56.24/escola', novaEscola) as EscolaType;
                          
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

  const enviaEscolaEdicao= async () =>{
    const escolaCorrigida = {
      ...novaEscola,
      localidade: { id: typeof escola!.localidade === 'number' ? escola!.localidade : escola!.localidade.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://177.74.56.24/escola/${escola!.id}`, escolaCorrigida) as EscolaType;
              if (response && response.id) {
                return fetchEscolaAPI(response.id);
              }
              } catch (error) {
                
                Alert.alert(
                  "Erro ao editar",
                  "Não foi possível salvar as alterações. Tente novamente quando estiver online."
                );
                return null;
               
            }
          
          } else {
            if (!escola!.sincronizado && escola!.idLocal) {
             
              //Objeto ainda não sincronizado → atualizar no Realm
              const escolaAtualizada: EscolaType = {
                ...escola!,
                nome: novaEscola.nome,
                iniciativa: novaEscola.iniciativa,
                merenda: novaEscola.merenda?? "",
                transporte: novaEscola.transporte ?? "",
                educacaoAmbiental: novaEscola.educacaoAmbiental?? "",
              };
              
              
              const escolaQueue = await salvarEscola(escolaAtualizada);
              return escolaQueue;
            } else {
              // Objeto sincronizado → não permitir edição offline
              Alert.alert(
                "Sem conexão",
                "Este registro já foi sincronizado. Para editá-lo, conecte-se à internet."
              );
              return null;
            }
          }
          
  }
  
   const fetchEscolaAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<EscolaType>(`http://177.74.56.24/escola/${id}`);
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
