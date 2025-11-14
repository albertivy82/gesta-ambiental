import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { EsferaEnum } from "../../../enums/esfera.enum";
import { SimNao } from "../../../enums/simNao.enum";
import { salvarEscola, salvarEscolaQueue } from "../../../realm/services/escolaService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { escolaInput } from "../../../shared/types/EscolaInput";
import { EscolaType } from "../../../shared/types/EscolaType";


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


export const FIELD_LABEL_ESCOLA: Partial<Record<keyof escolaInput, string>> = {
  nome: 'Nome da escola',
  iniciativa: 'Iniciativa (municipal/estadual/federal)',
  merenda: 'Merenda escolar',
  transporte: 'Transporte escolar',
  educacaoAmbiental: 'Educação ambiental',
  // localidade não vou exigir aqui porque vem de cima
};


export const validateEscola = (data: escolaInput) => {
  const errors: { field: keyof escolaInput; message: string }[] = [];

  // campos obrigatórios diretos
  ([
    'nome',
    'iniciativa',
    'merenda',
    'transporte',
    'educacaoAmbiental',
  ] as (keyof escolaInput)[]).forEach((f) => {
    const v = data[f] as any;
    if (v === '' || v === null || v === undefined) {
      errors.push({
        field: f,
        message: `Preencha ${FIELD_LABEL_ESCOLA[f]}.`,
      });
    }
  });

  // se você quiser garantir que veio uma localidade válida:
  if (!data.localidade || (!data.localidade.id || data.localidade.id <= 0)) {
    errors.push({
      field: 'localidade',
      message: 'Selecione/Informe a localidade.',
    });
  }

  const missingFieldLabels = Array.from(
    new Set(
      errors
        .map((e) => FIELD_LABEL_ESCOLA[e.field])
        .filter(Boolean)
    )
  );

  return {
    isValid: errors.length === 0,
    errors,
    missingFieldLabels,
  };
};


export const useNovaEscola = (localidadeId: number, escola?: EscolaType) => {
  const [novaEscola, setNovaEscola] = useState<escolaInput>(DEFAULT_ESCOLA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    const { isValid } = validateEscola(novaEscola);
    setDisabled(!isValid);
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
    const testConnectionOne = await testConnection();
              if(!escola?.sincronizado && !testConnectionOne){
                         
                  Alert.alert("Registro Apenas Local");
                  const local = await salvarEscola(builEscolaAtualizada());
                  return local;
              }else{
                        
               const escolaCorrigida = {
                ...novaEscola,
                localidade: { id: typeof escola!.localidade === 'number' ? escola!.localidade : escola!.localidade.id }
              };
              const isConnected = await testConnection();
                        
                         if(isConnected){
                                //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
                                try{
                                  console.log("enviando para edição", escolaCorrigida)
                                  const response = await connectionAPIPut(`http://177.74.56.24/escola/${escola!.id}`, escolaCorrigida) as EscolaType;
                                  console.log("recebendo edição", response)
                                  if (response && response.id) {
                                       return fetchEscolaAPI(response.id);
                                  }else{
                                      const local = await salvarEscola(builEscolaAtualizada());
                                      return local;
                                  }
                                } catch (error) {
                                   const local = await await salvarEscola(builEscolaAtualizada());
                                   Alert.alert("Erro ao enviar edição", "Tente novamente online.");
                                   return local;
                                 }
                        } else {
                                if (!escola!.sincronizado && escola!.idLocal) {
                                    return await await salvarEscola(builEscolaAtualizada());
                                } else {
                                    Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
                                    return null;
                                 }
                          }
                  
              }
          
  }

   const builEscolaAtualizada = (): EscolaType => ({
    ...escola!,
    ...novaEscola,
    localidade: { id: typeof escola!.localidade === 'number' ? escola!.localidade : escola!.localidade.id },
    sincronizado: escola?.sincronizado,
    idLocal: escola?.idLocal,
    });
  
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
    validateEscola,
    disabled,
  };
};
