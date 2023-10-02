/*import React, { useState, useEffect } from 'react';
import checkNetworkConnectivity from './network';
import { syncPendingImoveis } from './SyncService';


export const DEFAULT_CREATE_IMOVEL = {
  rua: '',
  bairro: '',
  referencial: '',
  latitude: '',
  longitude: '',
  dataCehgada: '',
  pretendemudar: '',
  motivoVontadeMudanca: '',
  relacaoArea: '',
  relacaoVizinhos: '',
  limitesTerreno: '',
  meioTransporteDominante: '',
  linhasDeBarco: '',
  tipoSolo: '',
  esporteLazer: '',
};

export const useInputImoveis = ()=>{
  const [disabled, setDisabled] = useState<boolean>(true);
  const [novoImovel, setImovel] = useState<ImovelInput>(DEFAULT_CREATE_IMOVEL);
  const [isConnected, setIsConnected] = useState(false);
  const realm = new Realm({ schema: [ImovelQueueSchema] });
  
 useEffect(()=>{

    if(

        novoImovel. !== '' &&
        novoImovel.rua: !== '' &&
        novoImovel.bairro: !== '' &&
        novoImovel.referencial:!== '' &&
        novoImovel.latitude:!== '' &&
        novoImovel.longitude:!== '' &&
        novoImovel.dataCehgada:!== '' &&
        novoImovel.pretendemudar:!== '' &&
        novoImovel.motivoVontadeMudanca!== '' &&
        novoImovel.relacaoArea:!== '' &&
        novoImovel.relacaoVizinhos:!== '' &&
        novoImovel.limitesTerreno:!== '' &&
        novoImovel.meioTransporteDominante:!== '' &&
        novoImovel.linhasDeBarco:!== '' &&
        novoImovel.tipoSolo:!== '' &&
        novoImovel.esporteLazer: '',

    ) {
        setDisabled(false)
    }else{
        setDisabled(true)
    }

}, [novoImovel]);

  useEffect(() => {
    const checkConnectivity = async () => {
      const isConnected = await checkNetworkConnectivity();
      setIsConnected(isConnected);

      if (isConnected) {
         syncPendingImoveis();
      }
    };

    checkConnectivity();
  }, []);

  
  const handleCreateImovel = async (newImovel) => {
    if (isConnected) {
      try {
        const imovel = await sendImovelToServer(newImovel);
  
        // Verifique se o imóvel foi criado com sucesso no servidor
        if (imovel) {
          realm.write(() => {
          realm.create('Imovel', imovel);
          });
        }
      } catch (error) {
        console.error('Erro ao criar imovel:', error);
      }
    } else {
      // Envio para a fila do banco aqui (se necessário)
      realm.write(() => {
        realm.create('ImovelPendente', newImovel);
      });
    }
  };
  
     

  
  const handleOnChangeInput = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string
    ) =>{
       // event.persist();
        setImovel((currentImovel)=>({
        ...currentImovel,
        [name]: event.nativeEvent.text,
        }));
    };


  return{
    handleOnChangeInput,
    novoImovel,
    disabled,
    handleCreateImovel,
  };
};

export default useInputImoveis;*/
