import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AtividadeProdutivaInput } from "../../../shared/types/AtividadeProdutivaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";
import { salvarAtividade, salvarAtividadeQueue } from "../../../realm/services/atividadeProdutivaService";

export const DEFAULT_ATIVIDADE_PRODUTIVA_INPUT: AtividadeProdutivaInput = {
  atividade: '',
  pessoasEnvolvidas: 0,
  faturamentoAtividadeMesTotal: 0,
  benfeitoria: {
    id: 0,
  },
};

// LABELS para mensagens de erro
export const FIELD_LABEL_ATV: Partial<Record<keyof AtividadeProdutivaInput, string>> = {
  atividade: 'Ramo da atividade',
  pessoasEnvolvidas: 'Quantidade de pessoas envolvidas',
  faturamentoAtividadeMesTotal: 'Faturamento mensal total da atividade',
};


// Validação centralizada
export const validateAtividadeProdutiva = (data: AtividadeProdutivaInput) => {
  const errors: { field: keyof AtividadeProdutivaInput; message: string }[] = [];

  // atividade obrigatória
  if (!data.atividade || String(data.atividade).trim() === '') {
    errors.push({
      field: 'atividade',
      message: `Selecione ${FIELD_LABEL_ATV['atividade']}.`,
    });
  }

  // pessoasEnvolvidas: > 0 e < 100  (mantendo a mesma regra que você já usava)
  if (
    data.pessoasEnvolvidas === undefined ||
    data.pessoasEnvolvidas === null ||
    Number.isNaN(data.pessoasEnvolvidas) ||
    data.pessoasEnvolvidas <= 0 ||
    data.pessoasEnvolvidas >= 100
  ) {
    errors.push({
      field: 'pessoasEnvolvidas',
      message: `${FIELD_LABEL_ATV['pessoasEnvolvidas']} deve ser maior que 0 e menor que 100.`,
    });
  }

  // faturamento: >= 0 e <= 1.000.000 (também mantendo sua regra atual)
  if (
    data.faturamentoAtividadeMesTotal === undefined ||
    data.faturamentoAtividadeMesTotal === null ||
    Number.isNaN(data.faturamentoAtividadeMesTotal) ||
    data.faturamentoAtividadeMesTotal <= 0 ||
    data.faturamentoAtividadeMesTotal > 1000000
  ) {
    errors.push({
      field: 'faturamentoAtividadeMesTotal',
      message: `${FIELD_LABEL_ATV['faturamentoAtividadeMesTotal']} deve ser maior que R$ 0.00 e no máximo R$1.000.000.00`,
    });
  }

  const missingFieldLabels = Array.from(
    new Set(
      errors
        .map((e) => FIELD_LABEL_ATV[e.field])
        .filter(Boolean)
    )
  );

  return {
    isValid: errors.length === 0,
    errors,
    missingFieldLabels,
  };
};


export const useNovaAtvProd = (benfeitoria:BenfeitoriaType, atividade?: AtividadeProdutivaType)  => {
  const [novaAtividade, setNovaAtvProd] = useState<AtividadeProdutivaInput>(DEFAULT_ATIVIDADE_PRODUTIVA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaAtividade)
    const { isValid } = validateAtividadeProdutiva(novaAtividade);
    setDisabled(!isValid);
  }, [novaAtividade]);

  const objetoFila = () => {
    const atvProdData: AtividadeProdutivaInput = {
        ...novaAtividade, 
        sincronizado: false,  
        idLocal: uuidv4(),
  };
  
    if (benfeitoria.id > 0) {
        atvProdData.benfeitoria!.id = benfeitoria.id;
        atvProdData.idFather = "";
    } else if (benfeitoria.idLocal) {
        atvProdData.idFather = benfeitoria.idLocal;
        atvProdData.benfeitoria!.id = benfeitoria.id;
    } else {
        console.warn("ID local do benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return atvProdData;
  };
  

  const enviarRegistro = async () => {
    if (atividade) {
      return await enviaAtividadeProdutivaEdicao();
    } else {
      return await enviaAtividadeProdutivaNova();
    }
  };

  const enviaAtividadeProdutivaNova = async () =>{

 
    //benfeitoria offline
        if(!benfeitoria.sincronizado && benfeitoria.id<=0){
          //benfeitoria offline
          const atividadesDataQueue = objetoFila();
          const atividadesQueue = await salvarAtividadeQueue(atividadesDataQueue);
          return atividadesQueue;
         
  
        }else{
            novaAtividade.benfeitoria = {id:benfeitoria.id};
           
            const isConnected = await testConnection();
          
                  if(isConnected){
                    
                    try{
                       
                      const response = await connectionAPIPost('http://177.74.56.24/atividade-produtiva', novaAtividade) as AtividadeProdutivaType;
                     
                      if (response && response.id) {
                            return fetchAtividadeAPI(response.id);
                      }
  
                    } catch (error) {
                        const atividadesDataQueue = objetoFila();
                        const atividadesQueue = await salvarAtividadeQueue(atividadesDataQueue);
                        return atividadesQueue;
                       
                    }
                  }else{
                    const atividadesDataQueue = objetoFila();
                    const atividadesQueue = await salvarAtividadeQueue(atividadesDataQueue);
                    return atividadesQueue;
                       
                    
                  }
        }
  }

  const enviaAtividadeProdutivaEdicao= async () =>{


     const testConnectionOne = await testConnection();
            
            if(!atividade?.sincronizado && !testConnectionOne){
                   
                    Alert.alert("Registro Apenas Local");
                    const local = await salvarAtividade(buildAtividadeProdutivaAtualizada());
                     return local;
            
            }else{

    const atividadeCorrigida = {
      ...novaAtividade,
      benfeitoria: { id: typeof atividade!.benfeitoria === 'number' ? atividade!.benfeitoria : atividade!.benfeitoria.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
            try{
              
              const response = await connectionAPIPut(`http://177.74.56.24/atividade-produtiva/${atividade!.id}`, atividadeCorrigida) as AtividadeProdutivaType;
                    if (response && response.id) {
                      return fetchAtividadeAPI(response.id);
                    }else{
                      const local = await salvarAtividade(buildAtividadeProdutivaAtualizada());
                      return local;
                                        }
           } catch (error) {
              const local = await salvarAtividade(buildAtividadeProdutivaAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
          }
          
          } else {
            if (!atividade!.sincronizado && atividade!.idLocal) {
             return await salvarAtividade(buildAtividadeProdutivaAtualizada());
            } else {
             Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
            }
            
          }
        }
          
  }

  const buildAtividadeProdutivaAtualizada = (): AtividadeProdutivaType => ({
    ...atividade!,
    ...novaAtividade,
    benfeitoria: { id: typeof atividade!.benfeitoria === 'number' ? atividade!.benfeitoria : atividade!.benfeitoria.id },
    sincronizado: atividade?.sincronizado,
    idLocal: atividade?.idLocal,
    idFather: atividade?.idFather,
});
  
  
   const fetchAtividadeAPI = async(id:number) =>{
  
          try{
              const response = await connectionAPIGet<AtividadeProdutivaType>(`http://177.74.56.24/atividade-produtiva/${id}`);
              
              if (response) {
                const atividadeData = {
                    ...response,
                    sincronizado: true,
                    idLocal: '',
                    idFather: '',
                };
                   return await salvarAtividade(atividadeData);
              }else{
                      throw new Error('Dados de atividade Inválidos'); 
                  }
          } catch (error) {
                  console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
          }
    };
  


   
  const handleEnumChange = (field: keyof AtividadeProdutivaInput, value: any) => {
    setNovaAtvProd((current) => ({
           ...current,
           [field]: value,
         }));
  };

 
  const handleNumberChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>, 
    field: keyof AtividadeProdutivaInput
  ) => {
    let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos
  
    setNovaAtvProd((current) => ({
      ...current,
      [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
    }));
  };

  const handleOnChangeRendimentoMensal = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    let value = event.nativeEvent.text;
  
    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, '');
  
    // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
    const formattedValue = (parseInt(value, 10) / 100).toFixed(2);
  
    // Atualiza o estado com o valor formatado como número
    setNovaAtvProd((current) => ({
      ...current,
      faturamentoAtividadeMesTotal:parseFloat(formattedValue), // Salva como número para enviar à API
    }));
};
  


  return {
    novaAtividade,
    handleEnumChange,
    handleNumberChange,
    enviarRegistro,
    handleOnChangeRendimentoMensal,
    validateAtividadeProdutiva,
    disabled,
};
  


}  