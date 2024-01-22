import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { Vizinhos } from "../../../enums/Vizinhos";
import { documentacao } from "../../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../../enums/tipoSolo.enum";
import { transporteEnum } from "../../../enums/transporte.enum";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { formatarData } from "../../../shared/functions/data";
import { imovelInput } from "../../../shared/types/imovelInput";

export const DEFAUL_IMOVEL_INPUT: imovelInput = {
    rua:'',
    numero: '',
    bairro: '',
    referencial: '',
    latitude: '',
    longitude: '',
    areaImovel: 0,
    vizinhos: null,
    situacaoFundiaria: '',  // Defina como null ou um valor padrão
    documentacaoImovel: null, // Defina como null ou um valor padrão
    dataChegada: '',
    pretendeMudar: null,      // Defina como null ou um valor padrão
    motivoVontadeMudanca: '',
    relacaoArea: '',
    relacaoVizinhos: '',
    limites: null,    
    iluminacaoPublica: null, 
    programaInfraSaneamento: '',       // Defina como null ou um valor padrão
    transporte: null,         // Defina como null ou um valor padrão
    linhasDeBarco: '',
    tipoSolo: null,           // Defina como null ou um valor padrão
    esporteLazer: null,       // Defina como null ou um valor padrão
    localidade: {
        id: 0,
    },
};


export const useNovoImovel = () => {
    const [novoImovel, setNovoImovel] = useState<imovelInput>(DEFAUL_IMOVEL_INPUT);
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {


      console.log(novoImovel.rua,
      novoImovel.numero, 
      novoImovel.bairro, 
      novoImovel.referencial,
      novoImovel.latitude, 
      novoImovel.longitude, 
      novoImovel.vizinhos,
      novoImovel.situacaoFundiaria, 
      novoImovel.documentacaoImovel,
      novoImovel.dataChegada,
      novoImovel.pretendeMudar,
      novoImovel.motivoVontadeMudanca,
      novoImovel.relacaoArea,
      novoImovel.relacaoVizinhos,
      novoImovel.limites,
      novoImovel.iluminacaoPublica,
      novoImovel.transporte,
      novoImovel.programaInfraSaneamento,
      novoImovel.linhasDeBarco,
      novoImovel.tipoSolo,          
      novoImovel.esporteLazer,
      )

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
        formatarData(novoImovel.dataChegada) && 
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
        novoImovel.esporteLazer !== null ){
          setDisabled(false)
          console.log('eentrou no if??')
        } 
        console.log('executou use?')
    }, [novoImovel]);

    const inputImovelApi = async (id:number) => {
      console.log('caralho', id)
      novoImovel.localidade.id = id;
        try {
            const imovel = await connectionAPIPost('http://192.168.100.28:8080/imovel', novoImovel);
            
        } catch (error) {
            
        }
    };

    const handleOnChangeInput = (
        event: NativeSyntheticEvent<TextInputChangeEventData>,
        name: string|number
      ) => {
        //event.persist(); // Manter o evento sintético
        setNovoImovel((currentImovel) => ({
          ...currentImovel,
          [name]: event.nativeEvent.text,
        }));
      };

      const handleOnChangeData = ( event: NativeSyntheticEvent<TextInputChangeEventData>,
        name: string) => {
        const dataFormatada = formatarData(event.nativeEvent.text);
        setNovoImovel((currentUser) => ({
            ...currentUser,
            dataChegada: dataFormatada,
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

      const handleIluminacaoChange = (mudanca: SimNaoTalvez | "" | null) => {
        setNovoImovel((currentMudanca) => ({
          ...currentMudanca,
          iluminacaoPublica: mudanca,
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
        disabled,
    };
};
