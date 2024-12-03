import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarAtividadeProdutivaQueue } from "../../../realm/services/atividadeProdutivaService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AtividadeProdutivaInput } from "../../../shared/types/AtividadeProdutivaInput";

export const DEFAULT_ATIVIDADE_PRODUTIVA_INPUT: AtividadeProdutivaInput = {
  atividade: null,
  pessoasEnvolvidas: 0,
  faturamentoAtividadeMesTotal: 0,
  benfeitoria: {
    id: 0,
  },
};

// Hook para manipular um novo registro de `AtividadeProdutiva`
export const useNovaAtividadeProdutiva = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean)=> {
  const [novaAtividade, setNovaAtividade] = useState<AtividadeProdutivaInput>(
    DEFAULT_ATIVIDADE_PRODUTIVA_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaAtividade);
    if (
      novaAtividade.atividade !== null &&
      novaAtividade.pessoasEnvolvidas > 0 &&
      novaAtividade.faturamentoAtividadeMesTotal > 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaAtividade]);

  const objetoFila = () => {
    const atividadeProdutivaData: AtividadeProdutivaInput = {
      ...novaAtividade,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de atividade produtiva
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      atividadeProdutivaData.benfeitoria = { id: benfeitoriaId };
      atividadeProdutivaData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        atividadeProdutivaData.idFather = idBenfeitoriaLocal;
        atividadeProdutivaData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return atividadeProdutivaData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const atividadeProdutivaDataQueue = objetoFila();
      salvarAtividadeProdutivaQueue(atividadeProdutivaDataQueue);
      console.log("Atividade Produtiva case: benfeitoria offline");
    } else {
      novaAtividade.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/atividade-produtiva', novaAtividade);
        } catch (error) {
          const atividadeProdutivaDataQueue = objetoFila();
          salvarAtividadeProdutivaQueue(atividadeProdutivaDataQueue);
        }
      } else {
        const atividadeProdutivaDataQueue = objetoFila();
        salvarAtividadeProdutivaQueue(atividadeProdutivaDataQueue);
      }
    }
  };
  
  

  }  