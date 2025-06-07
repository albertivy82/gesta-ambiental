import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MamiferosInput } from "../../../shared/types/MamiferosInput";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { salvarMamifero, salvarMamiferosQueue } from "../../../realm/services/mamiferosService";
import { MamiferosType } from "../../../shared/types/MamiferosType";

export const DEFAULT_MAMIFEROS_INPUT: MamiferosInput = {
  
  especie: '',
  usoConsumo: null,
  usoComercio: null,
  usoCriacao: null,
  usoRemedio: null,
  usoOutros: null,
  problemasRelacionados: '',
  alimentacao: '',
  desricaoEspontanea: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovoMamifero = (entrevistado:EntrevistadoType, mamifero: MamiferosType) => {
  const [novoMamifero, setNovoMamifero] = useState<MamiferosInput>(DEFAULT_MAMIFEROS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novoMamifero);
    if (
      novoMamifero.especie !== '' &&
      novoMamifero.usoConsumo !== null &&
      novoMamifero.usoComercio !== null &&
      novoMamifero.usoCriacao !== null &&
      novoMamifero.usoRemedio !== null &&
      novoMamifero.usoOutros !== null &&
      novoMamifero.problemasRelacionados !== '' &&
      novoMamifero.alimentacao !== '' &&
      novoMamifero.desricaoEspontanea !== ''
    ) {
      setDisabled(false);
    } 
  }, [novoMamifero]);

  const objetoFila = () => {
    const mamiferoData: MamiferosInput = {
        ...novoMamifero, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (entrevistado.id > 0) {
        mamiferoData.entrevistado!.id = entrevistado.id;
        mamiferoData.idFather = "";
    } else if (entrevistado.idLocal) {
        mamiferoData.idFather = entrevistado.idLocal;
        mamiferoData.entrevistado!.id = entrevistado.id;
    } else {
        console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return mamiferoData;
  };

  const enviarRegistro = async () => {
    if (mamifero) {
      return await enviaMamiferoEdicao();
    } else {
      return await enviaMamiferoNovo();
    }
  };
  

  const enviaMamiferoNovo = async () =>{

 
    //entrevistado offline
        if(!entrevistado.sincronizado && entrevistado.id<=0){
          //entrevistado offline
          const mamiferoDataQueue = objetoFila();
          const mamiferoQueue = await salvarMamiferosQueue(mamiferoDataQueue);
          return mamiferoQueue;
         
  
        }else{
            novoMamifero.entrevistado = {id:entrevistado.id};
            const netInfoState = await NetInfo.fetch();
            const isConnected = await testConnection();
          
                  if(netInfoState.isConnected && isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://192.168.100.28:8080/mamifero', novoMamifero) as MamiferosType;
                          
                      if (response && response.id) {
                            return fetchMamiferoAPI(response.id);
                      }
  
                    } catch (error) {
                        const mamiferoDataQueue = objetoFila();
                        const mamiferoQueue = await salvarMamiferosQueue(mamiferoDataQueue);
                        return mamiferoQueue;
                       
                    }
                  }else{
                    const mamiferoDataQueue = objetoFila();
                    const mamiferoQueue = await salvarMamiferosQueue(mamiferoDataQueue);
                    return mamiferoQueue;
                       
                    
                  }
        }
  }

  const enviaMamiferoEdicao= async () =>{
    const mamiferoCorrigida = {
      ...novoMamifero,
      entrevistado: { id: typeof mamifero!.entrevistado === 'number' ? mamifero!.entrevistado : mamifero!.entrevistado.id }
    };
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
    
     if(netInfoState.isConnected && isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://192.168.100.28:8080/mamifero/${mamifero!.id}`, mamiferoCorrigida) as MamiferosType;
              if (response && response.id) {
                return fetchMamiferoAPI(response.id);
              }
              } catch (error) {
                
                Alert.alert(
                  "Erro ao editar",
                  "Não foi possível salvar as alterações. Tente novamente quando estiver online."
                );
                return null;
               
            }
          
          } else {
            if (!mamifero!.sincronizado && mamifero!.idLocal) {
             
              //Objeto ainda não sincronizado → atualizar no Realm
              const mamiferoAtualizado: MamiferoType = {
                ...mamifero!,
                especie: novaMamifero.especie,
                usoMedicinal: novaMamifero.usoMedicinal,
                usoAlimentacao: novaMamifero.usoAlimentacao,
                usoOrnamental: novaMamifero.usoOrnamental,
                usoComercial: novaMamifero.usoComercial,
                usaFlor: novaMamifero.usaFlor,
                usaFolha: novaMamifero.usaFolha,
                usaSemente: novaMamifero.usaSemente,
                usaFruto: novaMamifero.usaFruto,
                usaCasca: novaMamifero.usaCasca,
                usaRaiz: novaMamifero.usaRaiz,
                usoLeiteLatex: novaMamifero.usoLeiteLatex,
                outrosUsos: novaMamifero.outrosUsos,
                coletaLocalPublico: novaMamifero.coletaLocalPublico,
                coletaCultivo: novaMamifero.coletaCultivo,
                coletaCompra: novaMamifero.coletaCompra,
                coletaAmbienteEspecifica: novaMamifero.coletaAmbienteEspecifica,
                quemEnsinouUso: novaMamifero.quemEnsinouUso,
                repassaConhecimento: novaMamifero.repassaConhecimento,
                observacoesEspontaneas: novaMamifero.observacoesEspontaneas,
              };
              
              const mamiferoQueue = await salvarMamifero(mamiferoAtualizado);
              return mamiferoQueue;
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
  
   const fetchMamiferoAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<MamiferosType>(`http://192.168.100.28:8080/mamifero/${id}`);
              if (response) {
                const mamiferoData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarMamifero(mamiferoData);
              }else{
                      throw new Error('Dados de mamifero Inválidos'); 
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
      
        setNovoMamifero((current) => ({
          ...current,
          [name]: newValue,
        }));
      };
  
    const handleEnumChange = (field: keyof MamiferosInput, value: any) => {
      setNovoMamifero((current) => ({
             ...current,
             [field]: value,
           }));
    };
  
    const handleArrayFieldChange = (field: keyof MamiferosInput, values: string[]) => {
               const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
               setNovoMamifero((currentState) => ({
                 ...currentState,
                 [field]: concatenatedValues,
               }));
    };
  
  
    return {
      novoMamifero,
      enviarRegistro,
      handleOnChangeInput,
      handleEnumChange,
      handleArrayFieldChange,
      disabled,
  };


}