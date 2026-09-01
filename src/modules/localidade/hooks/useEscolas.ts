import { useEffect, useRef, useState } from "react";

import {
  apagarEscolaQueue,
  getEscolas,
  getEscolasDessincronizadas,
  salvarEscolas,
} from "../../../realm/services/escolaService";

import {
  connectionAPIGet,
  connectionAPIPost,
} from "../../../shared/functions/connection/connectionAPI";

import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EscolaType } from "../../../shared/types/EscolaType";


export const convertToEscolaInput = (escola: any) => {
  return {
    nome: escola.nome,
    iniciativa: escola.iniciativa,
    merenda: escola.merenda,
    transporte: escola.transporte,
    educacaoAmbiental: escola.educacaoAmbiental,
    localidade: {
      id: escola.localidade,
    },
  };
};


export const useEscolas = (
  localidadeId: number,
  foccus: boolean
) => {

  const [contagemEscolas, setContagemEscolas] = useState<number>(0);
  const [loadingEscolas, setLoadingEscolas] = useState<boolean>(true);

  const syncingRef = useRef(false);


  const sincronizeQueue = async () => {

    const escolasQueue =
      getEscolasDessincronizadas(localidadeId);

    if (escolasQueue.length > 0) {

      for (const escola of escolasQueue) {

        const novaEscolaInput =
          convertToEscolaInput(escola);

        const isConnected =
          await testConnection();

        if (isConnected) {

          try {

            const response =
              await connectionAPIPost(
                "/api/escola",
                novaEscolaInput
              );

            const escolaAPI =
              response as EscolaType;

            if (
              escolaAPI.id &&
              escola.idLocal
            ) {
              apagarEscolaQueue(
                escola.idLocal
              );
            }

          } catch (error) {
            console.error(
              "Erro na sincronização da escola:",
              error
            );
          }
        }
      }
    }
  };


  const fetchEscolasFromAPI = async () => {

    const isConnected =
      await testConnection();

    if (!isConnected) {
      return;
    }

    try {

      const escolasAPI =
        await connectionAPIGet<EscolaType[]>(
          `/api/escola/localidade-escola/${localidadeId}`
        );

      const escolasData: EscolaType[] =
        escolasAPI.map((escola) => ({
          ...escola,
          localidade: {
            id: escola.localidade.id,
          },
          sincronizado: true,
          idLocal: "",
        }));

      if (escolasData.length > 0) {

        await salvarEscolas(
          escolasData
        );

        setContagemEscolas(
          escolasData.length
        );

      }

    } catch (error) {

      console.error(
        "Erro ao recuperar escolas da API:",
        error
      );
    }
  };


  const fetchEscolasFromLocalDb = () => {

    const localData =
      getEscolas(localidadeId);

    setContagemEscolas(
      localData.length
    );
  };


  useEffect(() => {
  if (!foccus || !localidadeId) {
    return;
  }

  if (syncingRef.current) {
    return;
  }

  syncingRef.current = true;

  const sincronizarTudo = async () => {
    try {
      setLoadingEscolas(true);

      await sincronizeQueue();
      await fetchEscolasFromAPI();
      fetchEscolasFromLocalDb();

    } finally {
      setLoadingEscolas(false);
      syncingRef.current = false;
    }
  };

  sincronizarTudo();

}, [foccus, localidadeId]);


  return {
    contagemEscolas,
    loadingEscolas,
  };
};