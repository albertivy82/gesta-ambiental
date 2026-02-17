import { useEffect, useState } from "react";
import { apagarRendaOutrasFontesQueue, getRendaOutrasFontes, getRendaOutrasFontesDessincronizadas, salvarRendaOutrasFontes } from "../../../realm/services/rendaOutrasFontes";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { RendaOutrasFontesInput } from "../../../shared/types/RendaOutrasFontesInput";
import { RendaOutrasFontesType } from "../../../shared/types/RendaOutrasFontesType";

export const convertToRendaOFInput = (renda: any): RendaOutrasFontesInput => {
  console.log(renda.benfeitoria.id);
  return {
    fonte: renda.fonte,
    beneficiarios: renda.beneficiarios,
    rendaMesTotal: renda.rendaMesTotal,
    benfeitoria: {
      id: renda.benfeitoria,
    },
  };
};

export const useRendasOutrasFontes = (benfeitoriaId: number, foccus: Boolean) => {
  const [loadingOutrasRendas, setLoadingOutrasRendas] = useState<boolean>(true);
  const [rendasOF, setRendasOF] = useState<RendaOutrasFontesType[]>([]);

  const sincronizeRendaOFQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getRendaOutrasFontesDessincronizadas(benfeitoriaId);
      for (const renda of queue) {
        const rendaInput = convertToRendaOFInput(renda);
        const isConnected = await testConnection();
        if (isConnected) {
          try {
            const response = await connectionAPIPost('http://192.168.100.28:8080/outras-fontes-de-renda', rendaInput);
            const rendaAPI = response as RendaOutrasFontesType;
            if (rendaAPI.id) apagarRendaOutrasFontesQueue(renda.idLocal!);
          } catch (error) {
          //  console.error("Erro ao sincronizar renda:", error);
          }
        }
      }
    }
  };

  const fetchRendasRealm = () => {
    const dadosRealm = getRendaOutrasFontes(benfeitoriaId);
    if (dadosRealm.length > 0) {
      setRendasOF(prev => [...prev, ...dadosRealm]);
    }
  };

  const fetchRendasAPI = async () => {
    try {
      const response = await connectionAPIGet<RendaOutrasFontesType[]>(`http://192.168.100.28:8080/outras-fontes-de-renda/benfeitoria-outras-fontes-de-renda/${benfeitoriaId}`);
      const dadosAPI = response.map(renda => ({
        ...renda,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));
      if (dadosAPI.length > 0) {
        await salvarRendaOutrasFontes(dadosAPI);
        setRendasOF(prev => [...prev, ...dadosAPI]);
      }
    } catch (error) {
    //  console.error("Erro ao buscar rendas da API:", error);
    }
  };

  useEffect(() => {
    fetchRendasRealm();
    fetchRendasAPI();
    sincronizeRendaOFQueue();
  }, [foccus]);
  
  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingOutrasRendas(true);
        await sincronizeRendaOFQueue();
        await fetchRendasAPI();
        fetchRendasRealm();
        setLoadingOutrasRendas(false);
  };
  sincronizarTudo();
  }, [foccus]);
  return { rendasOF, loadingOutrasRendas };
};
