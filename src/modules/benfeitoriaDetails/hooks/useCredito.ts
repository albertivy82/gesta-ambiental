import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {
  apagarCreditoQueue,
  getCreditos,
  getCreditosDessincronizados,
  salvarCreditos
} from "../../../realm/services/creditoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { CreditoType } from "../../../shared/types/CreditoType";
import { CreditoInput } from "../../../shared/types/CreditoInput";

export const convertToCreditoInput = (credito: any): CreditoInput => {
  return {
    nome: credito.nome,
    valor: credito.valor,
    benfeitoria: {
      id: credito.benfeitoria.id,
    },
  };
};

export const useCreditos = (benfeitoriaId: number) => {
  const [creditos, setCreditos] = useState<CreditoType[]>([]);

  const sincronizeCreditoQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getCreditosDessincronizados(benfeitoriaId);
      for (const credito of queue) {
        const creditoInput = convertToCreditoInput(credito);
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected && (await testConnection())) {
          try {
            const response = await connectionAPIPost('http://192.168.100.28:8080/credito', creditoInput);
            const creditoAPI = response as CreditoType;
            if (creditoAPI.id) apagarCreditoQueue(credito.idLocal!);
          } catch (error) {
           // console.error("Erro ao sincronizar crédito:", error);
          }
        }
      }
    }
  };

  const fetchCreditoRealm = () => {
    const locais = getCreditos(benfeitoriaId);
    if (locais.length > 0) {
      setCreditos(prev => [...prev, ...locais]);
    }
  };

  const fetchCreditoAPI = async () => {
    try {
      const response = await connectionAPIGet<CreditoType[]>(`http://192.168.100.28:8080/credito/benfeitoria-credito/${benfeitoriaId}`);
      const dados = response.map(item => ({
        ...item,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));
      if (dados.length > 0) {
        await salvarCreditos(dados);
        setCreditos(prev => [...prev, ...dados]);
      }
    } catch (error) {
     // console.error("Erro ao buscar créditos da API:", error);
    }
  };

  useEffect(() => {
    fetchCreditoRealm();
    fetchCreditoAPI();
    sincronizeCreditoQueue();
  }, []);

  return { creditos };
};
