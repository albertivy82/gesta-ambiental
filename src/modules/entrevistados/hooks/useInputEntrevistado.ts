import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarEntrevistadoQueue } from "../../../realm/services/entrevistado";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { formatDateForApi } from "../../../shared/functions/data";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";

export const DEFAULT_ENTREVISTADO_INPUT: EntrevistadoInput = {
  nome: "",
  naturalidade: "",
  nascimentoData: "",
  sexo: null,
  apelido: "",
  escolaridade: null,
  estadoCivil: null,
  religiao: "",
  morador: null,
  dataChegada: "",
  pretendeMudar: null,
  motivoVontadeMudanca: "",
  relacaoAreaImovel: "",
  relacaoVizinhos: "",
  tipoAlimentacao: "",
  localCompras: "",
  servicosDeficitarios: "",
  sofreuAssaltos: 0,
  presenciouAssalto: 0,
  problemasDeViolenciaLocal: "",
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



export const useNovoEntrevistado = (id:number) => {
    const [novoEntrevistado, setnovoEntrevistado] = useState<EntrevistadoInput>(DEFAULT_ENTREVISTADO_INPUT);
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
      if (
          novoEntrevistado.nome !== '' && 
          novoEntrevistado.apelido !== '' && 
          novoEntrevistado.naturalidade !== '' && 
          novoEntrevistado.nascimentoData !== '' &&
          novoEntrevistado.sexo !== null &&
          novoEntrevistado.escolaridade !== null &&
          novoEntrevistado.estadoCivil !== null &&
          novoEntrevistado.morador !== null &&
          novoEntrevistado.dataChegada !== '' &&
          novoEntrevistado.pretendeMudar !== null &&
          novoEntrevistado.relacaoAreaImovel !== '' &&
          novoEntrevistado.relacaoVizinhos !== '' &&
          novoEntrevistado.tipoAlimentacao !== '' &&
          novoEntrevistado.localCompras !== '' &&
          novoEntrevistado.servicosDeficitarios !== '' &&
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
      
      salvarEntrevistadoQueue(entrevistadoData);
      
    };

  
  const enviarEntrevistado = async () => {
   
    novoEntrevistado.localidade.id = id;
    const netInfoState = await NetInfo.fetch();
    const isConnected = await testConnection();
      if (netInfoState.isConnected && isConnected) {
          try {
            await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistado);
            console.log("useInputEntrevistado.ts...enviando api...");
          } catch (error) {
            objetoFila();
            
          }
      } else {
          console.log("seInputEntrevistado.ts-enviarEntrevistado, deveria salava na fila, mas se perdeu");
          objetoFila();
                  
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
  setnovoEntrevistado((currentState) => ({
    ...currentState,
    [field]: values,
  }));
};




const handleEnumChange = (field: keyof EntrevistadoInput, value: any) => {
  setnovoEntrevistado((current) => ({
    ...current,
    [field]: value,
  }));
};

const handleNumberChange = (
  event: NativeSyntheticEvent<TextInputChangeEventData>, field: keyof EntrevistadoInput
) => {
  let value = event.nativeEvent.text.replace(/\D/g, '');
  const formattedValue = (parseInt(value, 10) / 100).toFixed(2);

  setnovoEntrevistado((current) => ({
    ...current,
    [field]: parseFloat(formattedValue), // Armazena como número
  }));
};




    
   
      
    

    return {
      novoEntrevistado,
      enviarEntrevistado,
      handleOnChangeInput,
      handleOnChangeData,
      handleEnumChange,
      handleArrayFieldChange,
      handleNumberChange,
      disabled,
    };
};
