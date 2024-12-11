
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarServicoComunicacaoQueue } from "../../../realm/services/servicosComunicacaoService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";


export const DEFAULT_SERVICOS_COMUNICACAO_INPUT: ServicosComunicacaoInput = {
  tipoServicoComunicacao: null,
  operadoraServicoComunicacao: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoServicoComunicacao = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novoServicoComunicacao, setNovoServicoComunicacao] = useState<ServicosComunicacaoInput>(DEFAULT_SERVICOS_COMUNICACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoServicoComunicacao);
    if (
      novoServicoComunicacao.tipoServicoComunicacao !== null &&
      novoServicoComunicacao.operadoraServicoComunicacao !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoServicoComunicacao]);

 
  const objetoFila = () => {
    const comunicacaoData: ServicosComunicacaoInput = {
      ...novoServicoComunicacao,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de aves
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      comunicacaoData.benfeitoria = { id: benfeitoriaId };
      comunicacaoData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        comunicacaoData.idFather = idBenfeitoriaLocal;
        comunicacaoData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return comunicacaoData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const comunicacaoDataQueue = objetoFila();
      salvarServicoComunicacaoQueue(comunicacaoDataQueue);
      console.log("Serviços de Comunicação case: benfeitoria offline");
    } else {
      novoServicoComunicacao.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/comunicacao', novoServicoComunicacao);
        } catch (error) {
          const comunicacaoDataQueue = objetoFila();
          salvarServicoComunicacaoQueue(comunicacaoDataQueue);
        }
      } else {
        const comunicacaoDataQueue = objetoFila();
        salvarServicoComunicacaoQueue(comunicacaoDataQueue);
      }
    }
  };
  
  
}