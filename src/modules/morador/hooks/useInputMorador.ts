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

// 🔹 rótulos dos campos
export const FIELD_LABEL: Partial<Record<keyof MoradorInput, string>> = {
  perfil: 'Perfil do morador',
  dataNascimento: 'Idade do morador',
  sexo: 'Sexo do morador',
  escolaridade: 'Escolaridade do morador',
  estadoCivil: 'Estado civil do morador',
  ondeEstuda: 'Situação de estudo',
  trabalho: 'Situação de trabalho',
  religiao: 'Religião do morador',
  doencas: 'Doenças / condições de saúde',
};

// 🔹 validador centralizado
export const validateMorador = (data: MoradorInput) => {
  const errors: { field: keyof MoradorInput; message: string }[] = [];

  // perfil obrigatório
  if (!data.perfil) {
    errors.push({
      field: 'perfil',
      message: `Selecione ${FIELD_LABEL.perfil}.`,
    });
  }

  // idade (dataNascimento = idade em anos)
  if (
    data.dataNascimento === undefined ||
    data.dataNascimento === null ||
    Number.isNaN(data.dataNascimento) ||
    data.dataNascimento <= 0 ||
    data.dataNascimento > 120
  ) {
    errors.push({
      field: 'dataNascimento',
      message: `Informe ${FIELD_LABEL.dataNascimento} entre 1 e 120 anos.`,
    });
  }

  // sexo, estado civil, escolaridade, religião
  ([
    'sexo',
    'estadoCivil',
    'escolaridade',
    'religiao',
  ] as (keyof MoradorInput)[]).forEach((f) => {
    const v = data[f] as any;
    if (v === null || v === undefined || (typeof v === 'string' && v.trim() === '')) {
      errors.push({
        field: f,
        message: `Preencha ${FIELD_LABEL[f]}.`,
      });
    }
  });

  // estudo: precisa ter sido respondido (Sim com detalhe ou Não)
  if (!data.ondeEstuda || data.ondeEstuda.trim().length === 0) {
    errors.push({
      field: 'ondeEstuda',
      message: `Informe ${FIELD_LABEL.ondeEstuda} (se estuda ou não).`,
    });
  }

  // trabalho: mesma lógica
  if (!data.trabalho || data.trabalho.trim().length === 0) {
    errors.push({
      field: 'trabalho',
      message: `Informe ${FIELD_LABEL.trabalho} (se trabalha ou não).`,
    });
  }

  // doenças: exige alguma resposta (inclusive se a opção for "Nenhuma")
  if (!data.doencas || data.doencas.trim().length === 0) {
    errors.push({
      field: 'doencas',
      message: `Informe ${FIELD_LABEL.doencas} (marque ao menos uma opção).`,
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

export const useNovoMorador = (benfeitoria:BenfeitoriaType, morador?: MoradorType)  => {
  const [novoMorador, setNovaMorador] = useState<MoradorInput>(DEFAULT_MORADOR_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);
 
  

  // 🔹 desabilita/bloqueia botão com base no validador
  useEffect(() => {
    const { isValid } = validateMorador(novoMorador);
    setDisabled(!isValid);
    console.log(novoMorador);
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
     const testConnectionOne = await testConnection();
        
        if(!morador?.sincronizado && !testConnectionOne){
               
                Alert.alert("Registro Apenas Local");
                const local = await salvarMorador(buildMoradorAtualizada());
                 return local;
        
        }else{

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
          
  }

  const buildMoradorAtualizada = (): MoradorType => ({
    ...morador!,
    ...novoMorador,
    benfeitoria: { id: typeof morador!.benfeitoria === 'number' ? morador!.benfeitoria : morador!.benfeitoria.id },
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
    enviarRegistro,
    handleNumberChange,
    handleSetNumber,
    validateMorador,
    disabled,
};
  


}  