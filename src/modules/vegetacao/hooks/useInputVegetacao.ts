import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { salvarVegetacao, salvarVegetacaoQueue } from "../../../realm/services/vegetacaoService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { VegetacaoType } from "../../../shared/types/VegetacaoType";

export const DEFAULT_VEGETACAO_INPUT: VegetacaoInput = {
  especie: '',
  usoMedicinal: null,
  usoAlimentacao: null,
  usoOrnamental: null,
  usoComercial: null,
  usaFlor: null,
  usaFolha: null,
  usaSemente: null,
  usaFruto: null,
  usaCasca: null,
  usaRaiz: null,
  usoLeiteLatex: null,
  outrosUsos: '',
  coletaLocalPublico: null,
  coletaCultivo: null,
  coletaCompra: null,
  coletaAmbienteEspecifica: null,
  quemEnsinouUso: '',
  repassaConhecimento: '',
  observacoesEspontaneas: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovaVegetacao = (entrevistado:EntrevistadoType, vegetacao?: VegetacaoType) => {
  const [novaVegetacao, setNovaVegetacao] = useState<VegetacaoInput>(DEFAULT_VEGETACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (
      novaVegetacao.especie !== '' &&
      novaVegetacao.usoMedicinal !== null &&
      novaVegetacao.usoAlimentacao !== null &&
      novaVegetacao.usoOrnamental !== null &&
      novaVegetacao.usoComercial !== null &&
      novaVegetacao.usaFlor !== null &&
      novaVegetacao.usaFolha !== null &&
      novaVegetacao.usaSemente !== null &&
      novaVegetacao.usaFruto !== null &&
      novaVegetacao.usaCasca !== null &&
      novaVegetacao.usaRaiz !== null &&
      novaVegetacao.usoLeiteLatex !== null &&
      novaVegetacao.outrosUsos !== '' &&
      novaVegetacao.coletaLocalPublico !== null &&
      novaVegetacao.coletaCultivo !== null &&
      novaVegetacao.coletaCompra !== null &&
      novaVegetacao.coletaAmbienteEspecifica !== null &&
      novaVegetacao.quemEnsinouUso !== '' &&
      novaVegetacao.repassaConhecimento !== '' &&
      novaVegetacao.observacoesEspontaneas !== ''
    ) {
      setDisabled(false);
  }
}, [novaVegetacao]);

  
const objetoFila = () => {
      const vegetacaoData: VegetacaoInput = {
          ...novaVegetacao, 
          sincronizado: false,  
          idLocal: uuidv4(),
    };
    
      if (entrevistado.id > 0) {
        vegetacaoData.entrevistado!.id = entrevistado.id;
        vegetacaoData.idFather = "";
      } else if (entrevistado.idLocal) {
        vegetacaoData.idFather = entrevistado.idLocal;
        vegetacaoData.entrevistado!.id = entrevistado.id;
      } else {
          console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
      }
    
      return vegetacaoData;
    };

    const enviarRegistro = async () => {
      if (vegetacao) {
        return await enviaVegetacaoEdicao();
      } else {
        return await enviaVegetacaoNovo();
      }
    };

    const enviaVegetacaoNovo = async () =>{

      
      //entrevistado offline
          if(!entrevistado.sincronizado && entrevistado.id<=0){
            //entrevistado offline
            const vegetacaoDataQueue = objetoFila();
            const vegetacaoQueue = await salvarVegetacaoQueue(vegetacaoDataQueue);
            return vegetacaoQueue;
           
    
          }else{
              novaVegetacao.entrevistado = {id:entrevistado.id};
              const netInfoState = await NetInfo.fetch();
              const isConnected = await testConnection();
            
                    if(netInfoState.isConnected && isConnected){
                      
                      try{
                         
                        const response = await connectionAPIPost('http://192.168.100.28:8080/vegetacao', novaVegetacao) as VegetacaoType;
                            
                        if (response && response.id) {
                              return fetchVegetacaoAPI(response.id);
                        }
    
                      } catch (error) {
                          const vegetacaoDataQueue = objetoFila();
                          const vegetacaoQueue = await salvarVegetacaoQueue(vegetacaoDataQueue);
                          return vegetacaoQueue;
                         
                      }
                    }else{
                      const vegetacaoDataQueue = objetoFila();
                      const vegetacaoQueue = await salvarVegetacaoQueue(vegetacaoDataQueue);
                      return vegetacaoQueue;
                         
                      
                    }
          }
    }

    const enviaVegetacaoEdicao= async () =>{
      const vegetacaoCorrigida = {
        ...novaVegetacao,
        entrevistado: { id: typeof vegetacao!.entrevistado === 'number' ? vegetacao!.entrevistado : vegetacao!.entrevistado.id }
      };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
       if(netInfoState.isConnected && isConnected){
              //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
              try{
                
                const response = await connectionAPIPut(`http://192.168.100.28:8080/vegetacao/${vegetacao!.id}`, vegetacaoCorrigida) as VegetacaoType;
                    if (response && response.id) {
                    return fetchVegetacaoAPI(response.id);
                    }else{
                      const local = await salvarVegetacao(buildVegetacaoAtualizada());
                      return local;
                    }
              } catch (error) {
                //console.error("Erro ao enviar PUT:", error);
                const local = await salvarVegetacao(buildVegetacaoAtualizada());
                Alert.alert("Erro ao enviar edição", "Tente novamente online.");
                return local;
                 
              }
            
            } else {
              if (!vegetacao!.sincronizado && vegetacao!.idLocal) {
               return await salvarVegetacao(buildVegetacaoAtualizada());
              } else {
                Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
                return null;
              }
            }
            
    }

    const buildVegetacaoAtualizada = (): VegetacaoType => ({
      ...vegetacao!,
      ...novaVegetacao,
      sincronizado: vegetacao?.sincronizado,
      idLocal: vegetacao?.idLocal,
      idFather: vegetacao?.idFather,
    });
    
     const fetchVegetacaoAPI = async(id:number) =>{
    
            try{
                const response = await connectionAPIGet<VegetacaoType>(`http://192.168.100.28:8080/vegetacao/${id}`);
                if (response) {
                  const vegetacaoData = {
                      ...response,
                      sincronizado: true,
                      idLocal: '',
                      idFather: '',
                  };
                     return await salvarVegetacao(vegetacaoData);
                }else{
                        throw new Error('Dados de vegetacao Inválidos'); 
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
        
          setNovaVegetacao((current) => ({
            ...current,
            [name]: newValue,
          }));
        };
    
      const handleEnumChange = (field: keyof VegetacaoInput, value: any) => {
        setNovaVegetacao((current) => ({
               ...current,
               [field]: value,
             }));
      };
    
      const handleArrayFieldChange = (field: keyof VegetacaoInput, values: string[]) => {
                 const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
                 setNovaVegetacao((currentState) => ({
                   ...currentState,
                   [field]: concatenatedValues,
                 }));
      };
    
    
      return {
        novaVegetacao,
        enviarRegistro,
        handleOnChangeInput,
        handleEnumChange,
        handleArrayFieldChange,
        disabled,
    };
    

}