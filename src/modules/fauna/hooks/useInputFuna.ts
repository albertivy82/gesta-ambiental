import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FaunaInput } from "../../../shared/types/FaunaInput";
import { salvarFaunaQueue } from "../../../realm/services/faunaService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";

export const DEFAULT_FAUNA_INPUT: FaunaInput = {
  especie: '',
  ocorreMata: null,
  ocorreRio: null,
  ocorreLago: null,
  ocorreRua: null,
  ocorreQuintal: null,
  outrasOcorrencias: null,
  frequenciaAtual: '',
  frequenciaPassada: null,
  tempoQueNaoVe: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaFauna = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novaFauna, setNovaFauna] = useState<FaunaInput>(DEFAULT_FAUNA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaFauna);
    if (
      novaFauna.especie !== '' &&
      novaFauna.ocorreMata !== null &&
      novaFauna.ocorreRio !== null &&
      novaFauna.ocorreLago !== null &&
      novaFauna.ocorreRua !== null &&
      novaFauna.ocorreQuintal !== null &&
      novaFauna.outrasOcorrencias !== null &&
      novaFauna.frequenciaAtual !== '' &&
      novaFauna.frequenciaPassada !== null &&
      novaFauna.tempoQueNaoVe !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaFauna]);

  const objetoFila = () => {
    const faunaData: FaunaInput = {
      ...novaFauna,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de fauna
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      faunaData.benfeitoria = { id: benfeitoriaId };
      faunaData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        faunaData.idFather = idBenfeitoriaLocal;
        faunaData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return faunaData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const faunaDataQueue = objetoFila();
      salvarFaunaQueue(faunaDataQueue);
      console.log("Fauna case: benfeitoria offline");
    } else {
      novaFauna.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/fauna', novaFauna);
        } catch (error) {
          const faunaDataQueue = objetoFila();
          salvarFaunaQueue(faunaDataQueue);
        }
      } else {
        const faunaDataQueue = objetoFila();
        salvarFaunaQueue(faunaDataQueue);
      }
    }
  };
  
  

}