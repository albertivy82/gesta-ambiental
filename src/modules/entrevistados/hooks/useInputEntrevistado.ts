import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarEntrevistado, salvarEntrevistadoQueue } from "../../../realm/services/entrevistado";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { formatDateForApi } from "../../../shared/functions/data";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { Alert } from "react-native";

export const DEFAULT_ENTREVISTADO_INPUT: EntrevistadoInput = {

  nome: '',
  naturalidade: '',
  nascimentoData: '',
  sexo: null,
  apelido: '',
  escolaridade: null,
  estadoCivil: null,
  religiao: '',
  morador: null,
  dataChegada: '',
  pretendeMudar: null,
  motivoVontadeMudanca: '',
  relacaoAreaImovel: '',
  relacaoVizinhos: '',
  tipoAlimentacao: '',
  localCompras: '',
  comoCuidaSaudeFamilia:'',
  servicosDeficitarios: "",
  sofreuAssaltos: 0,
  presenciouAssalto: 0,
  problemasDeViolenciaLocal: '',
  instituicaoConhecida:'',
  importanciaDeProtegerAmbiente: '',
  importanciaDeProtegerFauna: '',
  qualEspacoPrecisaSerPreservado: '',
  problemasRelacionadosAoAmbiente: '',
  conheceUcs: null,
  conheceUcProposta: null,
  conheceAreaUc: null,
  utilizaAreaUc: "",
  propostaMelhorarArea: "",
  indicadoConsultaPublica: "",
  contatoIndicadoConsultaPublica: "",
  localidade: {
    id: 0,
  },
};



export const useNovoEntrevistado = (id:number, entrevistado?: EntrevistadoType) => {
    const [novoEntrevistado, setnovoEntrevistado] = useState<EntrevistadoInput>(DEFAULT_ENTREVISTADO_INPUT);
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
     console.log(novoEntrevistado)
      if (
          novoEntrevistado.nome !== '' && 
          novoEntrevistado.naturalidade !== '' && 
          novoEntrevistado.nascimentoData !== '' &&
          novoEntrevistado.sexo !== null &&
          novoEntrevistado.apelido !== '' && 
          novoEntrevistado.escolaridade !== null &&
          novoEntrevistado.estadoCivil !== null &&
          novoEntrevistado.religiao !== '' &&
          novoEntrevistado.morador !== null &&
          novoEntrevistado.dataChegada !== '' &&
          novoEntrevistado.pretendeMudar !== null &&
          novoEntrevistado.relacaoAreaImovel !== '' &&
          novoEntrevistado.relacaoVizinhos !== '' &&
          novoEntrevistado.tipoAlimentacao !== '' &&
          novoEntrevistado.localCompras !== '' &&
          novoEntrevistado.comoCuidaSaudeFamilia!== '' &&
          novoEntrevistado.servicosDeficitarios !== '' &&
          novoEntrevistado.sofreuAssaltos > 0 &&
          novoEntrevistado.presenciouAssalto > 0 &&
          novoEntrevistado.problemasDeViolenciaLocal !== '' &&
          novoEntrevistado.instituicaoConhecida !== '' &&
          novoEntrevistado.importanciaDeProtegerAmbiente!== '' &&
          novoEntrevistado.importanciaDeProtegerFauna!== '' &&
          novoEntrevistado.qualEspacoPrecisaSerPreservado!== '' &&
          novoEntrevistado.problemasRelacionadosAoAmbiente!== '' &&
          novoEntrevistado.conheceUcs !== null &&
          novoEntrevistado.conheceUcProposta !== null &&
          novoEntrevistado.conheceAreaUc !== null &&
          novoEntrevistado.utilizaAreaUc !== '' &&
          novoEntrevistado.propostaMelhorarArea !== '' &&
          novoEntrevistado.indicadoConsultaPublica !== '' &&
          novoEntrevistado.contatoIndicadoConsultaPublica!== ''
          
      ) {
        
          setDisabled(false);
      }
      console.log("Valor do disabled após o set:", disabled);
  }, [novoEntrevistado]);
  

    
    const objetoFila = () => {
          
      const entrevistadoData: EntrevistadoInput = {
        
          ...novoEntrevistado, 
          sincronizado:false,  
          idLocal: uuidv4(), 
      };
      
      return salvarEntrevistadoQueue(entrevistadoData);
      
    };

    const enviarRegistro = async () => {
      if (entrevistado) {
        return await enviaEntrevistadoEdicao();
      } else {
        return await enviaEntrevistadoNova();
      }
    };
  
  const enviaEntrevistadoNova = async () => {
   
    novoEntrevistado.localidade.id = id;
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
      if (netInfoState.isConnected && isConnected) {
          try {
            console.log("useInputEntrevistado.ts...enviando api...", novoEntrevistado);
            const response = await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistado) as EntrevistadoType;
            if (response && response.id) {
              return fetchEntrevistadoAPI(response.id);
             }
        console.log("useInputEntrevistado.ts...enviando api...");
          } catch (error) {
            objetoFila();
          }
      } else {
          console.log("seInputEntrevistado.ts-enviarEntrevistado, deveria salava na fila, mas se perdeu");
          return objetoFila();
                  
      }
      
    };

    const enviaEntrevistadoEdicao= async () =>{
      const entrevistadoCorrigido = {
        ...novoEntrevistado,
        localidade: { id: typeof entrevistado!.localidade === 'number' ? entrevistado!.localidade : entrevistado!.localidade.id }
      };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      
       if(netInfoState.isConnected && isConnected){
              //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
              try{
                
                const response = await connectionAPIPut(`http://192.168.100.28:8080/entrevistado/${entrevistado!.id}`, entrevistadoCorrigido) as EntrevistadoType;
                if (response && response.id) {
                  return fetchEntrevistadoAPI(response.id);
                }
                } catch (error) {
                  
                  Alert.alert(
                    "Erro ao editar",
                    "Não foi possível salvar as alterações. Tente novamente quando estiver online."
                  );
                  return null;
                 
              }
            
            } else {
              if (!entrevistado!.sincronizado && entrevistado!.idLocal) {
               
                //Objeto ainda não sincronizado → atualizar no Realm
                const entrevistadoAtualizado: EntrevistadoType = {
                  ...entrevistado!,
                  nome: novoEntrevistado.nome,
                  naturalidade: novoEntrevistado.naturalidade,
                  nascimentoData: novoEntrevistado.nascimentoData,
                  sexo: novoEntrevistado.sexo,
                  apelido: novoEntrevistado.apelido,
                  escolaridade: novoEntrevistado.escolaridade,
                  estadoCivil: novoEntrevistado.estadoCivil,
                  religiao: novoEntrevistado.religiao,
                  morador: novoEntrevistado.morador,
                  dataChegada: novoEntrevistado.dataChegada,
                  pretendeMudar: novoEntrevistado.pretendeMudar,
                  motivoVontadeMudanca: novoEntrevistado.motivoVontadeMudanca,
                  relacaoAreaImovel: novoEntrevistado.relacaoAreaImovel,
                  relacaoVizinhos: novoEntrevistado.relacaoVizinhos,
                  tipoAlimentacao: novoEntrevistado.tipoAlimentacao,
                  localCompras: novoEntrevistado.localCompras,
                  comoCuidaSaudeFamilia: novoEntrevistado.comoCuidaSaudeFamilia,
                  servicosDeficitarios: novoEntrevistado.servicosDeficitarios,
                  sofreuAssaltos: novoEntrevistado.sofreuAssaltos,
                  presenciouAssalto: novoEntrevistado.presenciouAssalto,
                  problemasDeViolenciaLocal: novoEntrevistado.problemasDeViolenciaLocal,
                  instituicaoConhecida: novoEntrevistado.instituicaoConhecida,
                  importanciaDeProtegerAmbiente: novoEntrevistado.importanciaDeProtegerAmbiente,
                  importanciaDeProtegerFauna: novoEntrevistado.importanciaDeProtegerFauna,
                  qualEspacoPrecisaSerPreservado: novoEntrevistado.qualEspacoPrecisaSerPreservado,
                  problemasRelacionadosAoAmbiente: novoEntrevistado.problemasRelacionadosAoAmbiente,
                  conheceUcs: novoEntrevistado.conheceUcs,
                  conheceUcProposta: novoEntrevistado.conheceUcProposta,
                  conheceAreaUc: novoEntrevistado.conheceAreaUc,
                  utilizaAreaUc: novoEntrevistado.utilizaAreaUc,
                  propostaMelhorarArea: novoEntrevistado.propostaMelhorarArea,
                  indicadoConsultaPublica: novoEntrevistado.indicadoConsultaPublica,
                  contatoIndicadoConsultaPublica: novoEntrevistado.contatoIndicadoConsultaPublica,
                };
                
                
                const entrevistadoQueue = await salvarEntrevistado(entrevistadoAtualizado);
                return entrevistadoQueue;
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

    const fetchEntrevistadoAPI = async(id:number) =>{
    
            try{
                const response = await connectionAPIGet<EntrevistadoType>(`http://192.168.100.28:8080/entrevistado/${id}`);
                if (response) {
                  const bftData = {
                      ...response,
                      sincronizado: true,
                      idLocal: '',
                      idFather: '',
                  };
                     return await salvarEntrevistado(bftData);
                }else{
                        throw new Error('Dados de benfeitoria Inválidos'); 
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
    
      setnovoEntrevistado((currentImovel) => ({
        ...currentImovel,
        [name]: newValue,
      }));
      };

    
const handleOnChangeData = (selectedDate: Date, name: string) => {
            const dataFormatada = formatDateForApi(selectedDate);
            setnovoEntrevistado((currentUser) => ({
                ...currentUser,
                [name]: dataFormatada,
            }));
};


const handleArrayFieldChange = (field: keyof EntrevistadoInput, values: string[]) => {
  const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
  setnovoEntrevistado((currentState) => ({
      ...currentState,
      [field]: concatenatedValues, // Salva como string no estado
  }));
};



const handleEnumChange = (field: keyof EntrevistadoInput, value: any) => {
  setnovoEntrevistado((current) => ({
    ...current,
    [field]: value,
  }));
};

const handleNumberChange = (
  event: NativeSyntheticEvent<TextInputChangeEventData>, 
  field: keyof EntrevistadoInput
) => {
  let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos

  setnovoEntrevistado((current) => ({
    ...current,
    [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
  }));
};


return {
      novoEntrevistado,
      enviarRegistro,
      handleOnChangeInput,
      handleOnChangeData,
      handleEnumChange,
      handleArrayFieldChange,
      handleNumberChange,
      disabled,
    };
};
