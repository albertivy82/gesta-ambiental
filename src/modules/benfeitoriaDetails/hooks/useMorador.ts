import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarMoradorQueue, getMoradores, getMoradoresDessincronizados, salvarMoradores } from "../../../realm/services/moradorService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { MoradorInput } from "../../../shared/types/MoradorInput";
import { MoradorType } from "../../../shared/types/MoradorType";
import { setIdMoradorFromApiOnInstituicao } from "../../../realm/services/instituicaoConhecidaService";

export const convertToMoradorInput = (morador: any): MoradorInput => {
  console.log(morador.benfeitoria);
  return {
    
    perfil: morador.perfil,
    dataNascimento: morador.dataNascimento,
    sexo: morador.sexo,
    escolaridade: morador.escolaridade,
    estadoCivil: morador.estadoCivil,
    ondeEstuda: morador.ondeEstuda,
    trabalho: morador.trabalho,
    religiao: morador.religiao,
    doencas: morador.doencas,
    benfeitoria: {
      id: morador.benfeitoria,
    },
  };
};

export const useMoradores = (benfeitoriaId: number, foccus: Boolean) => {
  const [moradores, setMoradores] = useState<MoradorType[]>([]);

  const sincronizeMoradoresQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getMoradoresDessincronizados(benfeitoriaId);
      console.log("1", queue)
      if (queue.length > 0) {
        for (const morador of queue) {
          const novoMoradorInput = convertToMoradorInput(morador);
         
       
            const isConnected = await testConnection();
            if (isConnected) {
              try {
                console.log("2", novoMoradorInput)
                const response = await connectionAPIPost('http://177.74.56.24/morador', novoMoradorInput);
                console.log("3", response)
                const moradorAPI = response as MoradorType;
                console.log("4", moradorAPI)
                if (moradorAPI.id) {
                  setIdMoradorFromApiOnInstituicao(moradorAPI.id, morador.idLocal!)
                  apagarMoradorQueue(morador.idLocal!);
                }
              } catch (error) {
                //console.error('Erro na sincronização de morador:', error);
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
        `http://177.74.56.24/morador/benfeitoria-morador/${benfeitoriaId}`
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
      //console.error('Erro ao recuperar moradores da API:', error);
    }
  };

  useEffect(() => {
    fetchMoradoresRealm();
    fetchMoradoresAPI();
    sincronizeMoradoresQueue();
  }, [foccus]);

  return { moradores };
};
