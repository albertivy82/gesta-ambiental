import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { Vizinhos } from "../../../enums/Vizinhos";
import { documentacao } from "../../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../../enums/tipoSolo.enum";
import { transporteEnum } from "../../../enums/transporte.enum";
import { salvarImovelQueue } from "../../../realm/services/imovelService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { formatDateForApi } from "../../../shared/functions/data";
import { imovelInput } from "../../../shared/types/imovelInput";
import { gerenciarEntrevistado } from "../gerenciarEntrevistado";
import { setIdImovelFromApiOnEntrevistado } from "../../../realm/services/entrevistado";
import { imovelBody } from "../../../shared/types/imovelType";

export const DEFAUL_IMOVEL_INPUT: imovelInput = {
    rua:'',
    numero: '',
    bairro: '',
    referencial: '',
    latitude: '',
    longitude: '',
    areaImovel: 0,
    vizinhos: null,
    situacaoFundiaria: '',  
    documentacaoImovel: null, 
    dataChegada: '',
    pretendeMudar: null,      
    motivoVontadeMudanca: '',
    relacaoArea: '',
    relacaoVizinhos: '',
    limites: null,    
    iluminacaoPublica: null, 
    programaInfraSaneamento: '',       
    transporte: null,         
    linhasDeBarco: '',
    tipoSolo: null,          
    esporteLazer: null,       
    localidade: {
        id: 0,
    },
};


export const useNovoImovel = (id:number) => {
    const [novoImovel, setNovoImovel] = useState<imovelInput>(DEFAUL_IMOVEL_INPUT);
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {

       if(
        novoImovel.rua !== '' && 
        novoImovel.numero !== '' && 
        novoImovel.bairro !== '' && 
        novoImovel.referencial !== '' && 
        novoImovel.latitude !== '' && 
        novoImovel.longitude !== '' && 
        novoImovel.areaImovel > 1 &&
        novoImovel.vizinhos != null &&
        novoImovel.situacaoFundiaria !== '' && 
        novoImovel.documentacaoImovel != null &&
        novoImovel.dataChegada && 
        novoImovel.pretendeMudar != null &&
        novoImovel.motivoVontadeMudanca !== '' && 
        novoImovel.relacaoArea !== '' && 
        novoImovel.relacaoVizinhos !== '' && 
        novoImovel.limites !== null &&
        novoImovel.iluminacaoPublica !== null &&
        novoImovel.transporte !== '' && 
        novoImovel.programaInfraSaneamento !== '' &&
        novoImovel.linhasDeBarco !== '' && 
        novoImovel.tipoSolo !== null &&           
        novoImovel.esporteLazer !== null )
        {
          setDisabled(true)
        } 
       
    }, [novoImovel]);

    const objetoFila =()=>{
     
        const imovelData: imovelInput = {
          ...novoImovel, 
          localidade: {
            id:id
          },
          sincronizado: false,  
          idLocal: uuidv4(),

        }
        return imovelData
    }

    const inputImovelApi = async (entrevistadoIdLocal:string) => {
      
      novoImovel.localidade.id = id;
      const netInfoState = await NetInfo.fetch();
     
      if(netInfoState.isConnected){
        
              const isConnected = await testConnection();
              
              if (isConnected){
              
                      try {
                          const imovel = await connectionAPIPost<imovelBody>('http://192.168.100.28:8080/imovel', novoImovel);
                          gerenciarEntrevistado(entrevistadoIdLocal, imovel.idLocal, imovel.id);
                      } catch (error) {
                        const registroNaoEnviado = objetoFila()
                        salvarImovelQueue(registroNaoEnviado)
                        gerenciarEntrevistado(entrevistadoIdLocal, registroNaoEnviado.idLocal, undefined)
                        console.error('Objeto armazenado internamente. Erro:', error);
                      }
              }else{
                
                const registroNaoEnviado = objetoFila()
                salvarImovelQueue(registroNaoEnviado)
                gerenciarEntrevistado(entrevistadoIdLocal, registroNaoEnviado.idLocal, undefined)
                        
              }
    }else{
      
      const registroNaoEnviado = objetoFila()
      salvarImovelQueue(registroNaoEnviado)
      gerenciarEntrevistado(entrevistadoIdLocal, registroNaoEnviado.idLocal, undefined)
     
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

    

      const handleVizinhosChange = (vizinhos: Vizinhos | "" | null) => {
        setNovoImovel((currentoVizinhos) => ({
          ...currentoVizinhos,
          vizinhos: vizinhos,
        }));
      };

      const handleFundiarioChange = (situacaoFundiaria: situacaoFundiaria | "" | null) => {
        setNovoImovel((currentSituacao) => ({
          ...currentSituacao,
          situacaoFundiaria: situacaoFundiaria,
        }));
      };

      const handleDocumentacaoChange = (documentacao: documentacao | "" | null) => {
        setNovoImovel((currentDocumnetacao) => ({
          ...currentDocumnetacao,
          documentacaoImovel: documentacao,
        }));
      };

      const handleSimNaoChange = (mudanca: SimNaoTalvez | "" | null) => {
        setNovoImovel((currentMudanca) => ({
          ...currentMudanca,
          pretendeMudar: mudanca,
        }));
      };

      const handleIluminacaoChange = (iluminacao: SimNaoTalvez | "" | null) => {
        setNovoImovel((currentIluminacao) => ({
          ...currentIluminacao,
          iluminacaoPublica: iluminacao,
        }));
      };

      const handleLimitesChange = (limites: limitesTerrenoEnum | "" | null) => {
        setNovoImovel((currentLimites) => ({
          ...currentLimites,
          limites: limites,
        }));
      };

      const handleTransporteChange = (transporte: transporteEnum | "" | null) => {
        setNovoImovel((currenttransporte) => ({
          ...currenttransporte,
          transporte: transporte,
        }));
      };

      const handleSoloChange = (solo: tipoSoloEnum | "" | null) => {
        setNovoImovel((currentSolo) => ({
          ...currentSolo,
          tipoSolo: solo,
        }));
      };

      const handleLazerChange = (lazer: esporteLazerEnum | "" | null) => {
        setNovoImovel((currentLazer) => ({
          ...currentLazer,
          esporteLazer: lazer,
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
      
      
    

    return {
        novoImovel,
        handleOnChangeInput,
        inputImovelApi,
        handleDocumentacaoChange,
        handleTransporteChange,
        handleLazerChange,
        handleSoloChange,
        handleLimitesChange,
        handleSimNaoChange,
        handleFundiarioChange,
        handleVizinhosChange,
        handleOnChangeData,
        handleIluminacaoChange,
        handleOnChangeAreaImovel,
        disabled,
    };
};
