import { useEffect, useRef, useState } from "react";
import { getEntrevistados, salvarEntrevistados } from "../../../realm/services/entrevistado";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";

export const useContagemEntrevistados = (localidadeId: number, foccus: boolean) => {
  const [contagemEntrevistados, setContagemEntrevistados] = useState<number>(0);
  const [loadingEntrevistado, setLoadingEntrevistado] = useState<boolean>(true);

  // evita rodar 2x ao voltar rápido na navegação
  const runningRef = useRef(false);

  // evita “resquício” (setState atrasado) se sair da tela/localidade
  const runIdRef = useRef(0);

  const fetchEntrevistadosFromAPI = async (isCancelled: () => boolean) => {
    const isConnected = await testConnection();
    if (!isConnected) return;

    const entrevistadoAPI = await connectionAPIGet<EntrevistadoType[]>(
      `http://177.74.56.24/entrevistado/localidade-entrevistado/${localidadeId}`
    );

    const entrevistadoData: EntrevistadoType[] = (entrevistadoAPI ?? []).map((entrevistado) => ({
      ...entrevistado,
      localidade: { id: entrevistado.localidade.id },
      sincronizado: true,
      idLocal: "",
    }));

    // se API não tiver nada, só sai (contagem fica 0)
    if (!entrevistadoData.length) return;

    await salvarEntrevistados(entrevistadoData);

    if (!isCancelled()) {
      setContagemEntrevistados(entrevistadoData.length);
    }
  };

  const fetchEntrevistadosFromLocalDb = async (isCancelled: () => boolean) => {
    const localData = getEntrevistados(localidadeId);

    if (!isCancelled()) {
      setContagemEntrevistados(localData.length);
    }

    // 🔥 regra principal: só chama API se estiver zerado
    if (localData.length === 0) {
      await fetchEntrevistadosFromAPI(isCancelled);
    }
  };

  useEffect(() => {
    if (!foccus || !localidadeId) return;

    // não deixa duas execuções simultâneas
    if (runningRef.current) return;
    runningRef.current = true;

    const myRunId = ++runIdRef.current;
    let cancelled = false;
    const isCancelled = () => cancelled || myRunId !== runIdRef.current;

    const run = async () => {
      setLoadingEntrevistado(true);
      try {
        await fetchEntrevistadosFromLocalDb(isCancelled);
      } finally {
        if (!isCancelled()) setLoadingEntrevistado(false);
        // libera o lock (mesmo se cancelou)
        runningRef.current = false;
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [foccus, localidadeId]);

  return { contagemEntrevistados, loadingEntrevistado };
};
