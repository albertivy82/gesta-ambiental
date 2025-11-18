import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {
  apagarServicoComunicacaoQueue,
  getServicosComunicacao,
  getServicosComunicacaoDessincronizados,
  salvarServicosComunicacao,
} from "../../../realm/services/servicosComunicacaoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";

export const convertToServicoComunicacaoInput = (item: any) => {
  
  return {
    tipoServicoComunicacao: item.tipoServicoComunicacao,
    operadoraServicoComunicacao: item.operadoraServicoComunicacao,
    benfeitoria: {
      id: item.benfeitoria,
    },
  };
};

export const useServicosComunicacao = (benfeitoriaId: number, foccus: Boolean) => {
  const [loadingComunicacoes, setLoadingComunicacoes] = useState<boolean>(true);
  const [servicos, setServicos] = useState<ServicosComunicacaoType[]>([]);

  const sincronizeQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getServicosComunicacaoDessincronizados(benfeitoriaId);

      if (queue.length > 0) {
        for (const item of queue) {
          const input = convertToServicoComunicacaoInput(item);
          
          const isConnected = await testConnection();
          if (isConnected) {
            try {
              
              const response = await connectionAPIPost('http://177.74.56.24/servico-de-comunicacao', input);
              
               const servComAPI = response as ServicosComunicacaoType;
              
              if (servComAPI?.id) apagarServicoComunicacaoQueue(item.idLocal!);
            } catch (error) {
              console.error('Erro na sincronização dos serviços de comunicação:', error);
            }
          }
        }
      }
    }
  };

  const fetchFromRealm = () => {
    const data = getServicosComunicacao(benfeitoriaId);
    if (data.length > 0) {
      setServicos((prev) => [...prev, ...data]);
    }
  };

  const fetchFromAPI = async () => {
    try {
      const response = await connectionAPIGet<ServicosComunicacaoType[]>(`http://177.74.56.24/servico-de-comunicacao/benfeitoria-servico-de-comunicacao/${benfeitoriaId}`);
      const data = response.map((item) => ({
        ...item,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));
      if (data.length > 0) {
        await salvarServicosComunicacao(data);
        setServicos((prev) => [...prev, ...data]);
      }
    } catch (error) {
      //console.error("Erro ao recuperar serviços de comunicação da API:", error);
    }
  };

  

  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingComunicacoes(true);
        await sincronizeQueue();
        await fetchFromAPI();
        fetchFromRealm();
      setLoadingComunicacoes(false);
  };
  sincronizarTudo();
  }, [foccus]);

  return { servicos, loadingComunicacoes };
};
