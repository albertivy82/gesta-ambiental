import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AguaType } from "../../../shared/types/AguaType";
import { AguaInput } from "../../../shared/types/AguaInput";
import {apagarAguaQueue, getAguaDessincronizadas, getAguas, salvarAguas} from "../../../realm/services/aguasService"

export const convertToAguaInput = (agua: any): AguaInput => {
  return {
    tipoDeFornecimento: agua.tipoDeFornecimento,
    qualidadeDaAgua: agua.qualidadeDaAgua,
    metodoTratamento: agua.metodoTratamento,
    corDagua: agua.corDagua,
    cheiroDagua: agua.cheiroDagua,
    saborDagua: agua.saborDagua,
    profundidadePoco: agua.profundidadePoco,
    benfeitoria: {
      id: agua.benfeitoria.id,
    },
  };
};

export const useAguas = (benfeitoriaId: number) => {
  const [aguas, setAguas] = useState<AguaType[]>([]);

  const sincronizeAguaQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getAguaDessincronizadas(benfeitoriaId);
      for (const agua of queue) {
        const aguaInput = convertToAguaInput(agua);
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected && (await testConnection())) {
          try {
            const response = await connectionAPIPost('http://192.168.100.28:8080/agua', aguaInput);
            const aguaAPI = response as AguaType;
            if (aguaAPI.id) apagarAguaQueue(agua.idLocal!);
          } catch (error) {
            console.error("Erro ao sincronizar água:", error);
          }
        }
      }
    }
  };

  const fetchAguaRealm = () => {
    const locais = getAguas(benfeitoriaId);
    if (locais.length > 0) {
      setAguas(prev => [...prev, ...locais]);
    }
  };

  const fetchAguaAPI = async () => {
    try {
      const response = await connectionAPIGet<AguaType[]>(`http://192.168.100.28:8080/agua/benfeitoria-agua/${benfeitoriaId}`);
      const dados = response.map(item => ({
        ...item,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));
      if (dados.length > 0) {
        await salvarAguas(dados);
        setAguas(prev => [...prev, ...dados]);
      }
    } catch (error) {
      console.error("Erro ao buscar águas da API:", error);
    }
  };

  useEffect(() => {
    fetchAguaRealm();
    fetchAguaAPI();
    sincronizeAguaQueue();
  }, []);

  return { aguas };
};
