import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarImovelQueue } from "../../../realm/services/imovelService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { formatDateForApi } from "../../../shared/functions/data";
import { imovelInput } from "../../../shared/types/imovelInput";
import { imovelBody } from "../../../shared/types/imovelType";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";


export const DEFAUL_IMOVEL_INPUT: imovelInput = {
     rua: '',
    numero: '',
    bairro: '',
    referencial: '',
    latitude: '',
    longitude: '',
    areaImovel: 0,
    tipoSolo: null,
    vizinhosConfinantes: '',
    situacaoFundiaria: null,
    documentacaoImovel: null,
    limites: null,
    linhasDeBarco: '',
    pavimentacao: '',
    iluminacaoPublica: null,
    equipamentosUrbanos: '',
    espacosEsporteLazer: null,
    programaInfraSaneamento: '',
    entrevistado: {
        id: 0,
    },
    
};




export const useNovoImovel = (entrevistado:EntrevistadoType) => {
    const [novoImovel, setNovoImovel] = useState<imovelInput>(DEFAUL_IMOVEL_INPUT);
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
      if (
          novoImovel.rua !== '' && 
          novoImovel.numero !== '' && 
          novoImovel.bairro !== '' && 
          novoImovel.referencial !== '' && 
          novoImovel.latitude !== '' && 
          novoImovel.longitude !== '' && 
          novoImovel.areaImovel > 1 &&
          novoImovel.vizinhosConfinantes !== '' &&
          novoImovel.situacaoFundiaria !== null &&
          novoImovel.documentacaoImovel !== null &&
          novoImovel.limites !== null &&
          novoImovel.linhasDeBarco !== '' &&
          novoImovel.pavimentacao !== '' &&
          novoImovel.iluminacaoPublica !== null &&
          novoImovel.equipamentosUrbanos !== '' &&
          novoImovel.espacosEsporteLazer !== null &&
          novoImovel.programaInfraSaneamento !== '' &&
          novoImovel.sincronizado !== null
      ) {
          setDisabled(false);
      }
  }, [novoImovel]);
  

  const objetoFila = () => {
    const imovelData: imovelInput = {
        ...novoImovel, 
        sincronizado: false,  
        idLocal: uuidv4(),
    };
  
    if (entrevistado.id > 0) {
        imovelData.entrevistado!.id = entrevistado.id;
        imovelData.idFather = "";
    } else if (entrevistado.idLocal) {
        imovelData.idFather = entrevistado.idLocal;
        imovelData.entrevistado!.id = entrevistado.id;
    } else {
        console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
    }
  
    return imovelData;
  };
  

  const inputImovelApi = async () => {
    
    if (!entrevistado.sincronizado && entrevistado.id <= 0) {
        const imovelDataQueue = objetoFila();
        salvarImovelQueue(imovelDataQueue);
    } else {
        novoImovel.entrevistado = { id: entrevistado.id };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
  
        if (netInfoState.isConnected && isConnected) {
            try {
                await connectionAPIPost('http://192.168.100.28:8080/imovel', novoImovel);
            } catch (error) {
                const imovelDataQueue = objetoFila();
                salvarImovelQueue(imovelDataQueue);
            }
        } else {
            const imovelDataQueue = objetoFila();
            salvarImovelQueue(imovelDataQueue);
        }
    }
  };
  


  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    // Verifica se "value" é um evento ou uma string diretamente
    const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
  
    setNovoImovel((currentImovel) => ({
      ...currentImovel,
      [name]: newValue,
    }));
  };
  
    const handleOnChangeData = (selectedDate: Date, name: string) => {
        const dataFormatada = formatDateForApi(selectedDate);
        setNovoImovel((currentUser) => ({
            ...currentUser,
            [name]: dataFormatada,
        }));
    };

   const handleEnumChange = (field: keyof imovelInput, value: any) => {
     setNovoImovel((current) => ({
       ...current,
       [field]: value,
     }));
   };
    
 const handleOnChangeAreaImovel = (
        event: NativeSyntheticEvent<TextInputChangeEventData>
      ) => {
        let value = event.nativeEvent.text;
      
        // Remove qualquer caractere não numérico
        value = value.replace(/\D/g, '');
      
        // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
        const formattedValue = (parseInt(value, 10) / 100).toFixed(2);
      
        // Atualiza o estado com o valor formatado como número
        setNovoImovel((currentImovel) => ({
          ...currentImovel,
          areaImovel: parseFloat(formattedValue), // Salva como número para enviar à API
        }));
      };

      const handleArrayFieldChange = (field: keyof imovelInput, values: string[]) => {
        setNovoImovel((currentState) => ({
          ...currentState,
          [field]: values,
        }));
      };
      
      
    

    return {
        novoImovel,
        handleOnChangeInput,
        handleArrayFieldChange,
        handleEnumChange,
        inputImovelApi,
        handleOnChangeData,
        handleOnChangeAreaImovel,
        disabled,
    };
};


