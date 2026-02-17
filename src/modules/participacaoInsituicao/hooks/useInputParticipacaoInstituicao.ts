import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarParticipacaoInstituicao, salvarParticipacaoInstituicaoQueue } from "../../../realm/services/ParticipacaoInstituicaoService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { MoradorType } from "../../../shared/types/MoradorType";
import { ParticipacaoInstituicaoInput } from "../../../shared/types/ParticipacaoInstituicaoInput";
import { ParticipacaoInstituicaoType } from "../../../shared/types/ParticipacaoInstituicaoType";

export const DEFAULT_VEGETACAO_INPUT: ParticipacaoInstituicaoInput = {
  instituicao: '',
  tipoDeRegistro: '',
  registro: '',
  morador: {
    id: 0,
  },
};

export const FIELD_LABEL: Partial<Record<keyof ParticipacaoInstituicaoInput, string>> = {
  instituicao: 'Instituição',
  tipoDeRegistro: 'Tipo de registro',
  registro: 'Número de registro',
};

export const validateParticipacaoInstituicao = (data: ParticipacaoInstituicaoInput) => {
  const errors: { field: keyof ParticipacaoInstituicaoInput; message: string }[] = [];

  // instituição obrigatória
  if (!data.instituicao || data.instituicao.trim().length === 0) {
    errors.push({
      field: 'instituicao',
      message: `Selecione ${FIELD_LABEL.instituicao}.`,
    });
  }

  // tipo de registro obrigatório
  if (!data.tipoDeRegistro || data.tipoDeRegistro.trim().length === 0) {
    errors.push({
      field: 'tipoDeRegistro',
      message: `Informe ${FIELD_LABEL.tipoDeRegistro}.`,
    });
  }

  // número de registro obrigatório
  if (!data.registro || data.registro.trim().length === 0) {
    errors.push({
      field: 'registro',
      message: `Informe ${FIELD_LABEL.registro}.`,
    });
  }

  const missingFieldLabels = Array.from(
    new Set(
      errors
        .map((e) => FIELD_LABEL[e.field])
        .filter(Boolean)
    )
  );

  return {
    isValid: errors.length === 0,
    errors,
    missingFieldLabels,
  };
};


export const useNovaParticipacaoInstituicao = (morador:MoradorType, participacaoInstituicao?: ParticipacaoInstituicaoType) => {
  const [novaParticipacaoInstituicao, setNovaParticipacaoInstituicao] = useState<ParticipacaoInstituicaoInput>(DEFAULT_VEGETACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);
  
  useEffect(() => {
    const { isValid } = validateParticipacaoInstituicao(novaParticipacaoInstituicao);
    setDisabled(!isValid);
  }, [novaParticipacaoInstituicao]);


  
const objetoFila = () => {
      const participacaoInstituicaoData: ParticipacaoInstituicaoInput = {
          ...novaParticipacaoInstituicao, 
          sincronizado: false,  
          idLocal: uuidv4(),
    };
    
      if (morador.id > 0) {
        participacaoInstituicaoData.morador!.id = morador.id;
        participacaoInstituicaoData.idFather = "";
      } else if (morador.idLocal) {
        participacaoInstituicaoData.idFather = morador.idLocal;
        participacaoInstituicaoData.morador!.id = morador.id;
      } else {
          console.warn("ID local do morador não encontrado. Verifique se está sendo passado corretamente.");
      }
    
      return participacaoInstituicaoData;
    };

    const enviarRegistro = async () => {
      if (participacaoInstituicao) {
        
        return await enviaParticipacaoInstituicaoEdicao();
      } else {
         return await enviaParticipacaoInstituicaoNovo();
      }
    };

    const enviaParticipacaoInstituicaoNovo = async () =>{

      
      //morador offline
          if(!morador.sincronizado && morador.id<=0){
            //morador offline
            const participacaoInstituicaoDataQueue = objetoFila();
            const participacaoInstituicaoQueue = await salvarParticipacaoInstituicaoQueue(participacaoInstituicaoDataQueue);
            return participacaoInstituicaoQueue;
           
    
          }else{
              novaParticipacaoInstituicao.morador = {id:morador.id};
             
              const isConnected = await testConnection();
            
                    if(isConnected){
                      
                      try{
                        
                        const response = await connectionAPIPost('http://192.168.100.28:8080/participacao-instituicao', novaParticipacaoInstituicao) as ParticipacaoInstituicaoType;
                        console.log(response)
                        if (response && response.id) {
                              return fetchParticipacaoInstituicaoAPI(response.id);
                        }
    
                      } catch (error) {
                          console.log(error)
                          const participacaoInstituicaoDataQueue = objetoFila();
                          const participacaoInstituicaoQueue = await salvarParticipacaoInstituicaoQueue(participacaoInstituicaoDataQueue);
                          return participacaoInstituicaoQueue;
                          
                         
                      }
                    }else{
                      const participacaoInstituicaoDataQueue = objetoFila();
                      const participacaoInstituicaoQueue = await salvarParticipacaoInstituicaoQueue(participacaoInstituicaoDataQueue);
                      return participacaoInstituicaoQueue;
                         
                      
                    }
          }
    }

    const enviaParticipacaoInstituicaoEdicao= async () =>{
      const testConnectionOne = await testConnection();
                          
                          if(!participacaoInstituicao?.sincronizado && !testConnectionOne){
                                 
                                //  Alert.alert("Registro Apenas Local");
                                  const local = await salvarParticipacaoInstituicao(buildParticipacaoInstituicaoAtualizada());
                                   return local;
                          
                          }else{
      const participacaoInstituicaoCorrigida = {
        ...novaParticipacaoInstituicao,
        morador: { id: typeof participacaoInstituicao!.morador === 'number' ? participacaoInstituicao!.morador : participacaoInstituicao!.morador.id }
      };
     
      const isConnected = await testConnection();
       if(isConnected){
              //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
              try{
                
                const response = await connectionAPIPut(`http://192.168.100.28:8080/participacao-instituicao/${participacaoInstituicao!.id}`, participacaoInstituicaoCorrigida) as ParticipacaoInstituicaoType;
                    if (response && response.id) {
                    return fetchParticipacaoInstituicaoAPI(response.id);
                    }else{
                      const local = await salvarParticipacaoInstituicao(buildParticipacaoInstituicaoAtualizada());
                      return local;
                    }
              } catch (error) {
                //console.error("Erro ao enviar PUT:", error);
                const local = await salvarParticipacaoInstituicao(buildParticipacaoInstituicaoAtualizada());
             //   Alert.alert("Erro ao enviar edição", "Tente novamente online.");
                return local;
                 
              }
            
            } else {
              if (!participacaoInstituicao!.sincronizado && participacaoInstituicao!.idLocal) {
               return await salvarParticipacaoInstituicao(buildParticipacaoInstituicaoAtualizada());
              } else {
           //     Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
                return null;
              }
            }
          }
            
    }

    const buildParticipacaoInstituicaoAtualizada = (): ParticipacaoInstituicaoType => ({
      ...participacaoInstituicao!,
      ...novaParticipacaoInstituicao,
      morador: { id: typeof participacaoInstituicao!.morador === 'number' ? participacaoInstituicao!.morador : participacaoInstituicao!.morador.id },
      sincronizado: participacaoInstituicao?.sincronizado,
      idLocal: participacaoInstituicao?.idLocal,
      idFather: participacaoInstituicao?.idFather,
    });
    
     const fetchParticipacaoInstituicaoAPI = async(id:number) =>{
    
            try{
                const response = await connectionAPIGet<ParticipacaoInstituicaoType>(`http://192.168.100.28:8080/participacao-instituicao/${id}`);
                if (response) {
                  const participacaoInstituicaoData = {
                      ...response,
                      sincronizado: true,
                      idLocal: '',
                      idFather: '',
                  };
                     return await salvarParticipacaoInstituicao(participacaoInstituicaoData);
                }else{
                     //   throw new Error('Dados de participacao instituicao Inválidos'); 
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
        
          setNovaParticipacaoInstituicao((current) => ({
            ...current,
            [name]: newValue,
          }));
        };
    
      const handleEnumChange = (field: keyof ParticipacaoInstituicaoInput, value: any) => {
        setNovaParticipacaoInstituicao((current) => ({
               ...current,
               [field]: value,
             }));
      };
    
      const handleArrayFieldChange = (field: keyof ParticipacaoInstituicaoInput, values: string[]) => {
                 const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
                 setNovaParticipacaoInstituicao((currentState) => ({
                   ...currentState,
                   [field]: concatenatedValues,
                 }));
      };
    
    
      return {
        novaParticipacaoInstituicao,
        enviarRegistro,
        handleOnChangeInput,
        handleEnumChange,
        handleArrayFieldChange,
        validateParticipacaoInstituicao,
        disabled,
    };
    

}