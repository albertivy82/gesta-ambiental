import { useEffect, useState } from "react";
import {
  apagarCreditoQueue,
  getCreditos,
  getCreditosDessincronizados,
  salvarCreditos
} from "../../../realm/services/creditoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { CreditoInput } from "../../../shared/types/CreditoInput";
import { CreditoType } from "../../../shared/types/CreditoType";

export const convertToCreditoInput = (credito: any): CreditoInput => {
  console.log(credito.benfeitoria.id);
  return {
    nome: credito.nome,
    valor: credito.valor,
    benfeitoria: {
      id: credito.benfeitoria,
    },
  };
};

export const useCreditos = (benfeitoriaId: number, foccus: Boolean) => {
  const [loadingCreditos, setLoadingCreditos] = useState<boolean>(true);
  const [creditos, setCreditos] = useState<CreditoType[]>([]);

  const sincronizeCreditoQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getCreditosDessincronizados(benfeitoriaId);
      for (const credito of queue) {
        const creditoInput = convertToCreditoInput(credito);
      console.log("credito", creditoInput)
        const isConnected = await testConnection();
         if (isConnected) {
          try {
            const response = await connectionAPIPost('http://177.74.56.24/credito', creditoInput);
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
   
      setCreditos(locais);
    
  };

  const fetchCreditoAPI = async () => {
    const isConnected = await testConnection();
  
    if (!isConnected) {
      console.log(`SYNC|CREDITO|API_SKIP_OFFLINE benfeitoria=${benfeitoriaId}`);
      return;
    }
  
    try {
      const response = await connectionAPIGet<CreditoType[]>(
        `http://177.74.56.24/credito/benfeitoria-credito/${benfeitoriaId}`
      );
  
      const dados = response.map(item => ({
        ...item,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));
  
      if (dados.length > 0) {
        await salvarCreditos(dados);
      }
    } catch (error) {
      // console.error("Erro ao buscar créditos da API:", error);
    }
  };
  

  
  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingCreditos(true);
        await sincronizeCreditoQueue();
        await fetchCreditoAPI();
        fetchCreditoRealm();
      setLoadingCreditos(false);
  };
  sincronizarTudo();
  }, [foccus]);

  return { creditos, loadingCreditos };
};
