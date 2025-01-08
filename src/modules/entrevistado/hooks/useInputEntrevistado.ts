import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { salvarEntrevistadoQueue } from "../../../realm/services/entrevistado";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { imovelBody } from "../../../shared/types/imovelType";
import { formatDateForApi } from "../../../shared/functions/data";

export const DEFAUL_ENTREVISTADO_INPUT: EntrevistadoInput = {
 
 nome:"",
 naturalidade:"",
 nascimentoData:"",
 sexo: null,
 apelido:"",
 escolaridade:null,
 estadoCivil:null,
 religiao:"",
 dataChegada:"",
 pretendeMudar: null;
 motivoVontadeMudanca: "",
 relacaoArea:"",
 relacaoVizinhos:"",
 conheceUc: SimNao;
 conheceUcProposta: SimNao| "" | null;
 conheceArea: SimNao;
 utilizaArea: String;
 propostaMelhorarArea: string; 
  conheceUcProposta: null,
  propostaMelhorarArea: '',
  imovel: {
    id:0,
  },
};


export const useNovoEntrevistado = () => {
    const [novoEntrevistado, setnovoEntrevistado] = useState<EntrevistadoInput>(DEFAUL_ENTREVISTADO_INPUT);
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
       
       if(
        novoEntrevistado.nome !== '' && 
        novoEntrevistado.apelido !== '' && 
        novoEntrevistado.naturalidade !== '' && 
        novoEntrevistado.conheceUcProposta != null &&
        novoEntrevistado.propostaMelhorarArea !== '' 
        )
        {
        
          setDisabled(false)
        } 
       
    }, [novoEntrevistado]);

    
    const objetoFila = () => {
          
      const entrevistadoData: EntrevistadoInput = {
        
          ...novoEntrevistado, 
          sincronizado:false,  
          idLocal: uuidv4(), 
      };
      
      salvarEntrevistadoQueue(entrevistadoData);

      return entrevistadoData.idLocal;
    };

    const enviarEntrevistado = async (entrevistado: EntrevistadoInput, imovel:imovelBody) => {
     
      if (!imovel.sincronizado && imovel.id <0) {
        salvarEntrevistadoQueue(entrevistado);
       
      } else {
        novoEntrevistado.imovel = { id: imovel.id };
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

    const handlePropostaUcChange = (conheceUcProposta: SimNaoTalvez | "" | null) => {
      setnovoEntrevistado((currentIluminacao) => ({
        ...currentIluminacao,
        conheceUcProposta: conheceUcProposta,
      }));
    };

     const handleOnChangeData = (selectedDate: Date, name: string) => {
            const dataFormatada = formatDateForApi(selectedDate);
            setnovoEntrevistado((currentUser) => ({
                ...currentUser,
                [name]: dataFormatada,
            }));
        };
    

      
    

    return {
      novoEntrevistado,
      enviarEntrevistado,
      handleOnChangeInput,
      handlePropostaUcChange,
      handleOnChangeData,
      objetoFila,
      disabled,
    };
};
