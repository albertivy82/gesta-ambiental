import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { RendaOutrasFontesType } from "../../../shared/types/RendaOutrasFontesType";
import { RendaOutrasFontesInput } from "../../../shared/types/RendaOutrasFontesInput";
import { apagarRendaOutrasFontesQueue, getRendaOutrasFontes, getRendaOutrasFontesDessincronizadas, salvarRendaOutrasFontes } from "../../../realm/services/rendaOutrasFontes";

export const convertToRendaOFInput = (renda: any): RendaOutrasFontesInput => {
  return {
    fonte: renda.fonte,
    beneficiarios: renda.beneficiarios,
    rendaMesTotal: renda.rendaMesTotal,
    benfeitoria: {
      id: renda.benfeitoria.id,
    },
  };
};

export const useRendasOutrasFontes = (benfeitoriaId: number) => {
  const [rendasOF, setRendasOF] = useState<RendaOutrasFontesType[]>([]);

  const sincronizeRendaOFQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getRendaOutrasFontesDessincronizadas(benfeitoriaId);
      for (const renda of queue) {
        const rendaInput = convertToRendaOFInput(renda);
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected && (await testConnection())) {
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
  }, []);

  return { rendasOF };
};
