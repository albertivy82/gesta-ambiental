import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarMoradorQueue, getMoradores, getMoradoresDessincronizados, salvarMoradores } from "../../../realm/services/moradorService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { MoradorType } from "../../../shared/types/MoradorType";
import { MoradorInput } from "../../../shared/types/MoradorInput";

export const convertToMoradorInput = (morador: any): MoradorInput => {
  return {
    dataNascimento: morador.dataNascimento,
    idade: morador.idade,
    perfil: morador.perfil,
    sexo: morador.sexo,
    estadoCivil: morador.estadoCivil,
    escolaridade: morador.escolaridade,
    ondeEstuda: morador.ondeEstuda,
    trabalho: morador.trabalho,
    religiao: morador.religiao,
    doencas: morador.doencas,
    benfeitoria: {
      id: morador.benfeitoria.id,
    },
  };
};

export const useMoradores = (benfeitoriaId: number) => {
  const [moradores, setMoradores] = useState<MoradorType[]>([]);

  const sincronizeMoradoresQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getMoradoresDessincronizados(benfeitoriaId);

      if (queue.length > 0) {
        for (const morador of queue) {
          const novoMoradorInput = convertToMoradorInput(morador);
          const netInfoState = await NetInfo.fetch();

          if (netInfoState.isConnected) {
            const isConnected = await testConnection();
            if (isConnected) {
              try {
                const response = await connectionAPIPost('http://192.168.100.28:8080/morador', novoMoradorInput);
                const moradorAPI = response as MoradorType;

                if (moradorAPI.id) {
                  apagarMoradorQueue(morador.idLocal!);
                }
              } catch (error) {
                console.error('Erro na sincronização de morador:', error);
              }
            }
          }
        }
      }
    }
  };

  const fetchMoradoresRealm = () => {
    const realmData = getMoradores(benfeitoriaId);
    if (realmData.length > 0) {
      setMoradores((prev) => [...prev, ...realmData]);
    }
  };

  const fetchMoradoresAPI = async () => {
    try {
      const response = await connectionAPIGet<MoradorType[]>(
        `http://192.168.100.28:8080/morador-benfeitoria/${benfeitoriaId}`
      );

      const apiData = response.map((item) => ({
        ...item,
        sincronizado: true,
        idLocal: '',
        idFather: '',
      }));

      if (apiData.length > 0) {
        await salvarMoradores(apiData);
        setMoradores((prev) => [...prev, ...apiData]);
      } else {
        throw new Error('Dados de moradores inválidos');
      }
    } catch (error) {
      console.error('Erro ao recuperar moradores da API:', error);
    }
  };

  useEffect(() => {
    fetchMoradoresRealm();
    fetchMoradoresAPI();
    sincronizeMoradoresQueue();
  }, []);

  return { moradores };
};
