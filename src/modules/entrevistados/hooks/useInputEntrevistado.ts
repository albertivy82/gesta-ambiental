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
import { parseOnlyNumeric } from "../../../shared/functions/onlyNumeric";

export const DEFAULT_ENTREVISTADO_INPUT: EntrevistadoInput = {

  nome: '',
  naturalidade: '',
  nascimentoData: 0,
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
     
      if (
          novoEntrevistado.nome !== '' && 
          novoEntrevistado.naturalidade !== '' && 
          novoEntrevistado.nascimentoData >= 18 &&
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
          novoEntrevistado.propostaMelhorarArea !== ''
             
      ) {
        
          setDisabled(false);
      }
      
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
        return await enviaEntrevistadoNovo();
      }
    };
  
  const enviaEntrevistadoNovo = async () => {
   
    novoEntrevistado.localidade.id = id;
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
      if (netInfoState.isConnected && isConnected) {
          try {
            const response = await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistado) as EntrevistadoType;
            if (response && response.id) {
              return fetchEntrevistadoAPI(response.id);
             }
        console.log("useInputEntrevistado.ts...enviando api...");
          } catch (error) {
            objetoFila();
          }
      } else {
         
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
                }else{
                    const local = await salvarEntrevistado(builEntrevistadoAtualizada());
                    return local;
                }
              } catch (error) {
                 const local = await await salvarEntrevistado(builEntrevistadoAtualizada());
                 Alert.alert("Erro ao enviar edição", "Tente novamente online.");
                 return local;
               }
        } else {
              if (!entrevistado!.sincronizado && entrevistado!.idLocal) {
                  return await await salvarEntrevistado(builEntrevistadoAtualizada());
              } else {
                  Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
                  return null;
               }
        }
                                          
}
                
                  const builEntrevistadoAtualizada = (): EntrevistadoType => ({
                    ...entrevistado!,
                    ...novoEntrevistado,
                    sincronizado: entrevistado?.sincronizado,
                    idLocal: entrevistado?.idLocal,
                  });

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

const handleSetNumber = (value: number, field: keyof EntrevistadoInput) => {
  setnovoEntrevistado((current) => ({
    ...current,
    [field]: value,
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
      handleSetNumber,
      disabled,
    };
};
