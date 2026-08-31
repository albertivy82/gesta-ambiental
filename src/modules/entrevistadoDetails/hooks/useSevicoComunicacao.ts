import { useEffect, useState } from "react";
import {
  apagarServicoComunicacaoQueue,
  getServicosComunicacao,
  getServicosComunicacaoDessincronizados,
  salvarServicosComunicacao,
} from "../../../realm/services/servicosComunicacaoService";
import {
  connectionAPIGet,
  connectionAPIPost,
} from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";

export const convertToServicoComunicacaoInput = (
  servico: any
): ServicosComunicacaoInput => {
  return {
    tipoServicoComunicacao: servico.tipoServicoComunicacao,
    operadoraServicoComunicacao: servico.operadoraServicoComunicacao,
    benfeitoria: {
      id: servico.benfeitoria,
    },
  };
};

export const useServicosComunicacao = (
  foccus: Boolean,
  benfeitoriaId: number
) => {
  const [loadingComunicacoes, setLoadingComunicacoes] =
    useState<boolean>(true);

  const [servicos, setServicos] =
    useState<ServicosComunicacaoType[]>([]);

  const sincronizeServicosComunicacaoQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue =
        getServicosComunicacaoDessincronizados(benfeitoriaId);

      if (queue.length > 0) {
        for (const servico of queue) {
          const novoServicoInput =
            convertToServicoComunicacaoInput(servico);

          const isConnected = await testConnection();

          if (isConnected) {
            try {
              const response = await connectionAPIPost(
                '/api/servico-de-comunicacao',
                novoServicoInput
              );

              const servicoAPI =
                response as ServicosComunicacaoType;

              if (servicoAPI.id) {
                apagarServicoComunicacaoQueue(
                  servico.idLocal!
                );
              }

            } catch (error) {
              // console.error(
              //   'Erro na sincronização dos serviços de comunicação:',
              //   error
              // );
            }
          }
        }
      }
    }
  };

  const fetchServicosComunicacaoRealm = () => {
    const realmData =
      getServicosComunicacao(benfeitoriaId);

    setServicos(realmData);
  };

  const fetchServicosComunicacaoAPI = async () => {
    const isConnected = await testConnection();

    if (isConnected) {
      try {
        const response =
          await connectionAPIGet<ServicosComunicacaoType[]>(
            `/api/servico-de-comunicacao/benfeitoria-servico-de-comunicacao/${benfeitoriaId}`
          );

        const apiData = response.map((item) => ({
          ...item,
          sincronizado: true,
          idLocal: '',
          idFather: '',
        }));

        if (apiData.length > 0) {
          await salvarServicosComunicacao(apiData);
        } else {
          throw new Error(
            'Dados de serviços de comunicação inválidos'
          );
        }

      } catch (error) {
        // console.error(
        //   'Erro ao recuperar serviços de comunicação da API:',
        //   error
        // );
      }
    }
  };

  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingComunicacoes(true);

      await sincronizeServicosComunicacaoQueue();
      await fetchServicosComunicacaoAPI();
      fetchServicosComunicacaoRealm();

      setLoadingComunicacoes(false);
    };

    sincronizarTudo();
  }, [foccus]);

  return {
    servicos,
    loadingComunicacoes,
  };
};