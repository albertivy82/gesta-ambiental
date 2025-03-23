import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {
  apagarAtividadeProdutivaQueue,
  getAtividadesProdutivas,
  getAtividadesProdutivasDessincronizadas,
  salvarAtividadesProdutivas,
} from "../../../realm/services/atividadeProdutivaService";
import {
  connectionAPIGet,
  connectionAPIPost,
} from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";


export const convertToAtividadeProdutivaInput = (atividade: any) => {
  return {
    atividade: atividade.atividade,
    pessoasEnvolvidas: atividade.pessoasEnvolvidas,
    faturamentoAtividadeMesTotal: atividade.faturamentoAtividadeMesTotal,
    benfeitoria: {
      id: atividade.benfeitoria.id,
    },
  };
};

export const useAtividadesProdutivas = (benfeitoriaId: number) => {
  const [atividades, setAtividades] = useState<AtividadeProdutivaType[]>([]);

  const sincronizeAtividadesQueue = async () => {
    if (benfeitoriaId > 0) {
      const fila = getAtividadesProdutivasDessincronizadas(benfeitoriaId);

      if (fila.length > 0) {
        for (const atividade of fila) {
          const novaAtividadeInput = convertToAtividadeProdutivaInput(atividade);
          const netInfoState = await NetInfo.fetch();

          if (netInfoState.isConnected) {
            const isConnected = await testConnection();
            if (isConnected) {
              try {
                const response = await connectionAPIPost(
                  "http://192.168.100.28:8080/atividade-produtiva",
                  novaAtividadeInput
                );
                const atividadeAPI = response as AtividadeProdutivaType;

                if (atividadeAPI.id) {
                  apagarAtividadeProdutivaQueue(atividade.idLocal!);
                }
              } catch (error) {
                console.error("Erro na sincronização da atividade produtiva:", error);
              }
            }
          }
        }
      }
    }
  };

  const fetchAtividadesRealm = () => {
    const atividadesRealm = getAtividadesProdutivas(benfeitoriaId);
    if (atividadesRealm.length > 0) {
      setAtividades((prev) => [...prev, ...atividadesRealm]);
    }
  };

  const fetchAtividadesAPI = async () => {
    try {
      const response = await connectionAPIGet<AtividadeProdutivaType[]>(
        `http://192.168.100.28:8080/atividade-produtiva/benfeitoria-atividade/${benfeitoriaId}`
      );

      const data = response.map((atividade) => ({
        ...atividade,
        sincronizado: true,
        idLocal: "",
        idFather: "",
      }));

      if (data.length > 0) {
        await salvarAtividadesProdutivas(data);
        setAtividades((prev) => [...prev, ...data]);
      } else {
        throw new Error("Dados de atividade produtiva inválidos");
      }
    } catch (error) {
      console.error("Erro ao recuperar atividades produtivas da API:", error);
    }
  };

  useEffect(() => {
    fetchAtividadesRealm();
    fetchAtividadesAPI();
    sincronizeAtividadesQueue();
  }, []);

  return { atividades };
};