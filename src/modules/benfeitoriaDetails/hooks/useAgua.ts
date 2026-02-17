import { useEffect, useState } from "react";
import { apagarAguaQueue, getAguaDessincronizadas, getAguas, salvarAguas } from "../../../realm/services/aguasService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AguaInput } from "../../../shared/types/AguaInput";
import { AguaType } from "../../../shared/types/AguaType";

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
      id: agua.benfeitoria,
    },
  };
};

export const useAguas = (benfeitoriaId: number, foccus: Boolean) => {
  const [loadingAguas, setLoadingAguas] = useState<boolean>(true);
  const [aguas, setAguas] = useState<AguaType[]>([]);
 
  const sincronizeAguaQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getAguaDessincronizadas(benfeitoriaId);
      for (const agua of queue) {
        const aguaInput = convertToAguaInput(agua);
        const isConnected = await testConnection();
         if (isConnected) {
          try {
            const response = await connectionAPIPost('http://192.168.100.28:8080/agua', aguaInput);
            const aguaAPI = response as AguaType;
            if (aguaAPI.id) apagarAguaQueue(agua.idLocal!);
          } catch (error) {
            //console.error("Erro ao sincronizar água:", error);
          }
        }
      }
    }
  };

  const fetchAguaRealm = () => {
    const locais = getAguas(benfeitoriaId);
    if (locais.length > 0) {
      setAguas((prevAguas) => [...prevAguas, ...locais]);
    }
  };

  const fetchAguaAPI = async () => {
    try {
      const response = await connectionAPIGet<AguaType[]>(`http://192.168.100.28:8080/agua/benfeitoria-agua/${benfeitoriaId}`);
      
      const aguaData = response.map(agua => ({
                      ...agua,
                      sincronizado: true,
                      idLocal: '',
                      idFather: '',
                  }));
                  
                  if (aguaData && Array.isArray(aguaData) && aguaData.length > 0) {
                      await salvarAguas(aguaData);
                      setAguas((prevAguas) => [...prevAguas, ...aguaData]);
                  }
    } catch (error) {
     // console.error("Erro ao buscar águas da API:", error);
    }
  };

  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingAguas(true);
        await sincronizeAguaQueue();
        await fetchAguaAPI();
        fetchAguaRealm();
      setLoadingAguas(false);
  };
  sincronizarTudo();
  }, [foccus]);

  return { aguas, loadingAguas};
  
};
