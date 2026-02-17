import { useEffect, useRef, useState } from "react";
import {
  apagarEntrevistadoQueue,
  getEntrevistados,
  getEntrevistadosDessincronizados,
  salvarEntrevistados
} from "../../../realm/services/entrevistado";
import { setIdEntrevistadoFromApiOnImovel } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";

export const convertToEntrevistadoInput = (entrevistado: any): EntrevistadoInput => {
  return {
    nome: entrevistado.nome,
    naturalidade: entrevistado.naturalidade,
    nascimentoData: entrevistado.nascimentoData,
    sexo: entrevistado.sexo,
    apelido: entrevistado.apelido,
    escolaridade: entrevistado.escolaridade,
    estadoCivil: entrevistado.estadoCivil,
    religiao: entrevistado.religiao,
    morador: entrevistado.morador,
    dataChegada: entrevistado.dataChegada,
    pretendeMudar: entrevistado.pretendeMudar,
    motivoVontadeMudanca: entrevistado.motivoVontadeMudanca,
    relacaoAreaImovel: entrevistado.relacaoAreaImovel,
    relacaoVizinhos: entrevistado.relacaoVizinhos,
    tipoAlimentacao: entrevistado.tipoAlimentacao,
    localCompras: entrevistado.localCompras,
    comoCuidaSaudeFamilia: entrevistado.comoCuidaSaudeFamilia,
    servicosDeficitarios: entrevistado.servicosDeficitarios,
    sofreuAssaltos: entrevistado.sofreuAssaltos,
    presenciouAssalto: entrevistado.presenciouAssalto,
    problemasDeViolenciaLocal: entrevistado.problemasDeViolenciaLocal,
    instituicaoConhecida: entrevistado.instituicaoConhecida,
    importanciaDeProtegerAmbiente: entrevistado.importanciaDeProtegerAmbiente,
    importanciaDeProtegerFauna: entrevistado.importanciaDeProtegerFauna,
    qualEspacoPrecisaSerPreservado: entrevistado.qualEspacoPrecisaSerPreservado,
    problemasRelacionadosAoAmbiente: entrevistado.problemasRelacionadosAoAmbiente,
    conheceUcs: entrevistado.conheceUcs,
    conheceUcProposta: entrevistado.conheceUcProposta,
    conheceAreaUc: entrevistado.conheceAreaUc,
    utilizaAreaUc: entrevistado.utilizaAreaUc,
    propostaMelhorarArea: entrevistado.propostaMelhorarArea,
    indicadoConsultaPublica: entrevistado.indicadoConsultaPublica,
    contatoIndicadoConsultaPublica: entrevistado.contatoIndicadoConsultaPublica,
    localidade: {
      id: entrevistado.localidade,
    },
  };
};

export const useEntrevistados = (localidadeId: number, foccus: boolean) => {
  const [contagemEntrevistados, setContagemEntrevistados] = useState<number>(0);
  const [loadingEntrevistado, setLoadingEntrevistado] = useState<boolean>(true);
  const syncingRef = useRef(false);

  // só pra rastrear cada execução completa do effect
  const runCounterRef = useRef(0);

  const sinconizeQueue = async () => {
    console.log(`SYNC|ENTREV|QUEUE_START localidadeId=${localidadeId}`);

    const EntrevistadoQueue = getEntrevistadosDessincronizados(localidadeId);
    console.log(`SYNC|ENTREV|QUEUE_GET localidadeId=${localidadeId} count=${EntrevistadoQueue?.length ?? 0}`);

    if (EntrevistadoQueue.length > 0) {
      for (const entrevistado of EntrevistadoQueue) {
        console.log(
          `SYNC|ENTREV|ITEM_START idLocal=${entrevistado?.idLocal ?? "null"} id=${entrevistado?.id ?? "null"} nome=${entrevistado?.nome ?? ""}`
        );

        const novoEntrevistadoIput = convertToEntrevistadoInput(entrevistado);

        const isConnected = await testConnection();
        console.log(`SYNC|ENTREV|CONNECTED=${isConnected}`);

        if (isConnected) {
          try {
            console.log(`SYNC|ENTREV|POST_START idLocal=${entrevistado?.idLocal ?? "null"}`);

            const response = await connectionAPIPost(
              "http://192.168.100.28:8080/entrevistado",
              novoEntrevistadoIput
            );

            const EntrevistadoAPI = response as EntrevistadoType;
            console.log(
              `SYNC|ENTREV|POST_OK idLocal=${entrevistado?.idLocal ?? "null"} apiId=${EntrevistadoAPI?.id ?? "null"}`
            );

            if (EntrevistadoAPI.id && entrevistado.idLocal) {
              console.log(
                `SYNC|ENTREV|LINK_IMOVEL_START idLocal=${entrevistado.idLocal} apiId=${EntrevistadoAPI.id}`
              );

              const updated = setIdEntrevistadoFromApiOnImovel(EntrevistadoAPI.id, entrevistado.idLocal!);
              console.log(
                `SYNC|ENTREV|LINK_IMOVEL_DONE idLocal=${entrevistado.idLocal} apiId=${EntrevistadoAPI.id} updated=${updated}`
              );

                      if (updated) {
                        console.log(`SYNC|ENTREV|DEL_QUEUE_START idLocal=${entrevistado.idLocal}`);
                        apagarEntrevistadoQueue(entrevistado.idLocal!);
                        console.log(`SYNC|ENTREV|DEL_QUEUE_DONE idLocal=${entrevistado.idLocal}`);
                      } else {
                        console.warn(
                          `SYNC|ENTREV|WARN link_imovel_updated_false idLocal=${entrevistado.idLocal} apiId=${EntrevistadoAPI.id}`
                        );
                      }
            } else {
              console.warn(
                `SYNC|ENTREV|WARN missing_ids apiId=${EntrevistadoAPI?.id ?? "null"} idLocal=${entrevistado?.idLocal ?? "null"}`
              );
            }
          } catch (error) {
            console.error(`SYNC|ENTREV|POST_ERR idLocal=${entrevistado?.idLocal ?? "null"}`, error);
          }
        } else {
          console.log(`SYNC|ENTREV|SKIP_OFFLINE idLocal=${entrevistado?.idLocal ?? "null"}`);
        }

        console.log(`SYNC|ENTREV|ITEM_END idLocal=${entrevistado?.idLocal ?? "null"}`);
      }
    }

    console.log(`SYNC|ENTREV|QUEUE_END localidadeId=${localidadeId}`);
  };

  const fetchEntrevistadosFromLocalDb = () => {
    console.log(`SYNC|ENTREV|REALM_FETCH_START localidadeId=${localidadeId}`);

    const localData = getEntrevistados(localidadeId);
    console.log(`SYNC|ENTREV|REALM_FETCH_DONE localidadeId=${localidadeId} count=${localData?.length ?? 0}`);

    if (localData.length > 0) {
      setContagemEntrevistados(localData.length);
    }
  };

  const fetchEntrevistadosFromAPI = async () => {
    console.log(`SYNC|ENTREV|API_FETCH_START localidadeId=${localidadeId}`);

    const isConnected = await testConnection();
    console.log(`SYNC|ENTREV|API_CONNECTED=${isConnected}`);

    if (isConnected) {
      try {
        const entrevistadoAPI = await connectionAPIGet<EntrevistadoType[]>(
          `http://192.168.100.28:8080/entrevistado/localidade-entrevistado/${localidadeId}`
        );

        console.log(`SYNC|ENTREV|API_FETCH_DONE localidadeId=${localidadeId} count=${entrevistadoAPI?.length ?? 0}`);

        const entrevistadoData: EntrevistadoType[] = entrevistadoAPI.map((entrevistado) => ({
          ...entrevistado,
          localidade: { id: entrevistado.localidade.id },
          sincronizado: true,
          idLocal: "",
        }));

        if (entrevistadoData && Array.isArray(entrevistadoData) && entrevistadoData.length > 0) {
          console.log(`SYNC|ENTREV|SAVE_START count=${entrevistadoData.length}`);
          await salvarEntrevistados(entrevistadoData);
          console.log(`SYNC|ENTREV|SAVE_DONE count=${entrevistadoData.length}`);

          const contagem = entrevistadoData.length;
          setContagemEntrevistados(contagem);
        } else {
          console.warn(`SYNC|ENTREV|WARN api_return_invalid localidadeId=${localidadeId}`);
          throw new Error("Dados de entrevistados Inválidos");
        }
      } catch (error) {
        console.error(`SYNC|ENTREV|API_ERR localidadeId=${localidadeId}`, error);
      }
    } else {
      console.log(`SYNC|ENTREV|API_SKIP_OFFLINE localidadeId=${localidadeId}`);
    }
  };

  useEffect(() => {
    const runId = ++runCounterRef.current;

    console.log(`SYNC|ENTREV|EFFECT_START runId=${runId} foccus=${foccus} localidadeId=${localidadeId}`);

    if (!foccus) {
      console.log(`SYNC|ENTREV|EFFECT_RETURN_NOT_FOCUS runId=${runId}`);
      return;
    }

    if (syncingRef.current) {
      console.log(`SYNC|ENTREV|EFFECT_RETURN_LOCKED runId=${runId}`);
      return;
    }

    syncingRef.current = true;
    console.log(`SYNC|ENTREV|EFFECT_LOCK_ON runId=${runId}`);

    const run = async () => {
      try {
        setLoadingEntrevistado(true);
        console.log(`SYNC|ENTREV|FLOW_START runId=${runId}`);

        await sinconizeQueue();
        await fetchEntrevistadosFromAPI();
        fetchEntrevistadosFromLocalDb();

        console.log(`SYNC|ENTREV|FLOW_DONE runId=${runId}`);
      } finally {
        setLoadingEntrevistado(false);
        syncingRef.current = false;

        console.log(`SYNC|ENTREV|EFFECT_LOCK_OFF runId=${runId}`);
        console.log(`SYNC|ENTREV|EFFECT_END runId=${runId}`);
      }
    };

    run();
  }, [foccus, localidadeId]);

  return { contagemEntrevistados, loadingEntrevistado };
};
