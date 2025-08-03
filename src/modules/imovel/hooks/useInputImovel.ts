import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarImovel, salvarImovelQueue } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
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
    tipoSolo: '',
    vizinhosConfinantes: '',
    situacaoFundiaria: '',
    documentacaoImovel: '',
    limites: '',
    linhasDeBarco: '',
    pavimentacao: '',
    iluminacaoPublica: null,
    equipamentosUrbanos: '',
    espacosEsporteLazer: '',
    programaInfraSaneamento: '',
    entrevistado: {
        id: 0,
    },
    
};




export const useNovoImovel = (entrevistado:EntrevistadoType, imovel?: imovelBody) => {
    const [novoImovel, setNovoImovel] = useState<imovelInput>(DEFAUL_IMOVEL_INPUT);
    const [disabled, setDisabled] = useState<boolean>(true);
   
    
  useEffect(() => {
    const areaValida = novoImovel.areaImovel >= 10 && novoImovel.areaImovel <= 1000000;
    
    console.log(novoImovel)
    if (
        novoImovel.rua !== '' &&
        novoImovel.numero !== '' &&
        novoImovel.bairro !== '' &&
        novoImovel.referencial !== '' &&
         areaValida &&
        novoImovel.tipoSolo !== '' &&
        novoImovel.vizinhosConfinantes !== '' &&
        novoImovel.situacaoFundiaria !== null &&
        novoImovel.documentacaoImovel !== null &&
        novoImovel.limites !== null &&
        novoImovel.linhasDeBarco !== '' &&
        novoImovel.pavimentacao !== '' &&
        novoImovel.iluminacaoPublica !== null &&
        novoImovel.equipamentosUrbanos !== '' &&
        novoImovel.espacosEsporteLazer !== null &&
        novoImovel.programaInfraSaneamento !== ''
        
    ) {
        setDisabled(false);
    } else {
        setDisabled(true);
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

  const enviarRegistro = async () => {
    if (imovel) {
      return await enviaImovelEdicao();
    } else {
      return await enviaImovelNovo();
    }
  };
  

  const enviaImovelNovo = async () => {
    
    if (!entrevistado.sincronizado && entrevistado.id <= 0) {
        const imovelDataQueue = objetoFila();
        const imovelQueue = await salvarImovelQueue(imovelDataQueue);
        return imovelQueue;
    } else {
        novoImovel.entrevistado = { id: entrevistado.id };
        console.log( novoImovel.entrevistado)
       
        const isConnected = await testConnection();
        
            if (isConnected) {
                try {
                  
                   console.log("novo", novoImovel)
                  const response = await connectionAPIPost('http://177.74.56.24/imovel', novoImovel) as imovelBody;
                  if (response && response.id) {
                    return fetchImovelAPI(response.id);
                   }      
                } catch (error) {
                  const imovelDataQueue = objetoFila();
                  const imovelQueue = await salvarImovelQueue(imovelDataQueue);
                  return imovelQueue;
                   
                }
            } else {
                const imovelDataQueue = objetoFila();
                const imovelQueue = await salvarImovelQueue(imovelDataQueue);
                return imovelQueue;
            }
    }
  };

  const enviaImovelEdicao= async () =>{
    const imovelCorrigido = {
      ...novoImovel,
      entrevistado: { id: typeof imovel!.entrevistado === 'number' ? imovel!.entrevistado : imovel!.entrevistado.id }
    };
   
    const isConnected = await testConnection();
    
     if(isConnected){
            //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser editados se forem efetivamente salvos 
            try{
              console.log("está ok",imovelCorrigido)
              const response = await connectionAPIPut(`http://177.74.56.24/imovel/${imovel!.id}`, imovelCorrigido) as imovelBody;
              
              if (response && response.id) {
                  return fetchImovelAPI(response.id);
              }else{
                  const local = await salvarImovel(buildImovelAtualizada());
                  return local;
              }
            } catch (error) {
              const local = await salvarImovel(buildImovelAtualizada());
              Alert.alert("Erro ao enviar edição", "Tente novamente online.");
              return local;
            }
    } else {
         if (!imovel!.sincronizado && imovel!.idLocal) {
             return await salvarImovel(buildImovelAtualizada());
         } else {
            Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
             return null;
          }
    }
                           
 }
                        
                
  const buildImovelAtualizada = (): imovelBody => ({
  ...imovel!,
   ...novoImovel,
     sincronizado: imovel?.sincronizado,
     idLocal: imovel?.idLocal,
      idFather: imovel?.idFather,
  });

   const fetchImovelAPI = async(id:number) =>{
      
              try{
                  const response = await connectionAPIGet<imovelBody>(`http://177.74.56.24/imovel/${id}`);
                  if (response) {
                    const imovelData = {
                        ...response,
                        sincronizado: true,
                        idLocal: '',
                        idFather: '',
                    };
                       return await salvarImovel(imovelData);
                  }else{
                          throw new Error('Dados de imovel Inválido'); 
                      }
              } catch (error) {
                      console.log("useInputImovel, fetchImovelAPI erro: ",  error);
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
        const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
        setNovoImovel((currentState) => ({
          ...currentState,
          [field]: concatenatedValues,
        }));
      };
      
       

    return {
        novoImovel,
        handleOnChangeInput,
        handleArrayFieldChange,
        handleEnumChange,
        enviarRegistro,
        handleOnChangeData,
        handleOnChangeAreaImovel,
        disabled,
    };
};


