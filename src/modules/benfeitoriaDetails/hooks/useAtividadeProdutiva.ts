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
  console.log(atividade.benfeitoria.id)
  return {
    atividade: atividade.atividade,
    pessoasEnvolvidas: atividade.pessoasEnvolvidas,
    faturamentoAtividadeMesTotal: atividade.faturamentoAtividadeMesTotal,
    benfeitoria: {
      id: atividade.benfeitoria,
    },
  };
};

export const useAtividadesProdutivas = (benfeitoriaId: number, foccus: Boolean) => {
  const [loadingAtividadesProdutivas, setLoadingAtividadesProdutivas] = useState<boolean>(true);
  const [atividades, setAtividades] = useState<AtividadeProdutivaType[]>([]);

  const sincronizeAtividadesQueue = async () => {
    if (benfeitoriaId > 0) {
      const fila = getAtividadesProdutivasDessincronizadas(benfeitoriaId);

      if (fila.length > 0) {
        for (const atividade of fila) {
          const novaAtividadeInput = convertToAtividadeProdutivaInput(atividade);
         console.log("atividade produtiva", novaAtividadeInput)
           const isConnected = await testConnection();
            if (isConnected) {
              try {
                const response = await connectionAPIPost(
                  "http://177.74.56.24/atividade-produtiva",novaAtividadeInput);
                   const atividadeAPI = response as AtividadeProdutivaType;

                if (atividadeAPI.id) {
                  apagarAtividadeProdutivaQueue(atividade.idLocal!);
                }
              } catch (error) {
                //console.error("Erro na sincronização da atividade produtiva:", error);
              }
            }
          
        }
      }
    }
  };

  const fetchAtividadesRealm = () => {
    const atividadesRealm = getAtividadesProdutivas(benfeitoriaId);
   
      setAtividades(atividadesRealm);
  
  };

  const fetchAtividadesAPI = async () => {
    const isConnected = await testConnection();
  
    if (!isConnected) {
      console.log(`SYNC|ATVPROD|API_SKIP_OFFLINE benfeitoria=${benfeitoriaId}`);
      return;
    }
  
    try {
      const response = await connectionAPIGet<AtividadeProdutivaType[]>(
        `http://177.74.56.24/atividade-produtiva/benfeitoria-atividadeProdutiva/${benfeitoriaId}`
      );
  
      const data = response.map((atividade) => ({
        ...atividade,
        sincronizado: true,
        idLocal: "",
        idFather: "",
      }));
  
      if (data.length > 0) {
        await salvarAtividadesProdutivas(data);
      } else {
        throw new Error("Dados de atividade produtiva inválidos");
      }
    } catch (error) {
      console.log("Erro ao recuperar atividades produtivas da API:", error);
    }
  };
  

  
  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingAtividadesProdutivas(true);
        await sincronizeAtividadesQueue();
        await fetchAtividadesAPI();
        fetchAtividadesRealm();
      setLoadingAtividadesProdutivas(false);
  };
  sincronizarTudo();
  }, [foccus]);

  return { atividades, loadingAtividadesProdutivas };
};