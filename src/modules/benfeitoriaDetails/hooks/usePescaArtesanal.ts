import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarPescaArtesanalQueue, getPescaArtesanal, getPescaArtesanalDessincronizadas, salvarPescasArtesanais } from "../../../realm/services/pescaService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { PescaArtesanalType } from "../../../shared/types/PescaArtesanal";
import { PescaArtesanalInput } from "../../../shared/types/PescaArtesanalInput";



export const convertToPescaArtesanalInput = (pesca: any): PescaArtesanalInput => {
  return {
   
    freqPescaSemanal: pesca.freqPescaSemanal,
    horasPorDia: pesca.horasPorDia,
    localDaPesca: pesca.localDaPesca,
    horarioPrefencialPesca: pesca.horarioPrefencialPesca,
    descartePorPescaria: pesca.descartePorPescaria,
    conservacaoPeixe: pesca.conservacaoPeixe,
    custeio: pesca.custeio,
    geloPorPescaria: pesca.geloPorPescaria,
    custoGeloPorPescaria: pesca.custoGeloPorPescaria,
    composicaoRancho: pesca.composicaoRancho,
    custoRanchoPorViagem: pesca.custoRanchoPorViagem,
    combustivelPorViagem: pesca.combustivelPorViagem,
    custoCombustivelPorViagem: pesca.custoCombustivelPorViagem,
    localDesembarque: pesca.localDesembarque,
    pescaPorSafra: pesca.pescaPorSafra,
    localPescaSafra: pesca.localPescaSafra,
    localDeReproducaoPeixe: pesca.localDeReproducaoPeixe,
    periodoDefeso: pesca.periodoDefeso,
    conheceDefeso: pesca.conheceDefeso, 
    concordaDefeso: pesca.concordaDefeso, 
    recebeDefeso: pesca.recebeDefeso,
    benfeitoria: {
      id: pesca.benfeitoria.id,
    },
  };
};

export const usePescaArtesanal = (benfeitoriaId: number) => {
  const [pescaArtesanal, setPescaArtesanal] = useState<PescaArtesanalType[]>([]);

  const sincronizePescaArtesanalQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getPescaArtesanalDessincronizadas(benfeitoriaId);
      if (queue.length > 0) {
        for (const item of queue) {
          const pescaInput = convertToPescaArtesanalInput(item);
          const netInfoState = await NetInfo.fetch();
          if (netInfoState.isConnected && await testConnection()) {
            try {
              const response = await connectionAPIPost('http://192.168.100.28:8080/pesca-artesanal', pescaInput);
              const data = response as PescaArtesanalType;
              if (data.id) apagarPescaArtesanalQueue(item.idLocal!);
            } catch (error) {
              console.error('Erro ao sincronizar pesca artesanal:', error);
            }
          }
        }
      }
    }
  };

  const fetchPescaArtesanalRealm = () => {
    const data = getPescaArtesanal(benfeitoriaId);
    if (data.length > 0) setPescaArtesanal(prev => [...prev, ...data]);
  };

  const fetchPescaArtesanalAPI = async () => {
    try {
      const response = await connectionAPIGet<PescaArtesanalType[]>(`http://192.168.100.28:8080/pesca-artesanal/benfeitoria-pesca-artesanal/${benfeitoriaId}`);
      const data = response.map(item => ({
        ...item,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));
      if (data.length > 0) {
        await salvarPescasArtesanais(data);
        setPescaArtesanal(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Erro ao recuperar pesca artesanal da API:", error);
    }
  };

  useEffect(() => {
    fetchPescaArtesanalRealm();
    fetchPescaArtesanalAPI();
    sincronizePescaArtesanalQueue();
  }, []);

  return { pescaArtesanal };
};
