import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { ParticipacaoInstituicaoInput } from "../../../shared/types/ParticipacaoInstituicaoInput";
import { ParticipacaoInstituicaoType } from "../../../shared/types/ParticipacaoInstituicaoType";
import { apagarParticipacaoInstituicaoQueue, getParticipacoesIntitucionais, getParticipacoesIntitucionaisDessincronizadas, salvarParticipacaoInstituicao, salvarParticipacoesIntitucionais } from "../../../realm/services/ParticipacaoInstituicaoService";

export const convertToParticipacaoInstituicaoInput = (ParticipacaoInstituicao: any): ParticipacaoInstituicaoInput => {
  return {
    
    instituicao: ParticipacaoInstituicao.instituicao,
    tipoDeRegistro: ParticipacaoInstituicao.tipoDeRegistro,
    registro: ParticipacaoInstituicao.registro,
    morador: {
      id: ParticipacaoInstituicao.morador,
    },
  };
};

export const useParticipacaoInstituicoes = (moradorId: number) => {
  const [participacaoInsituicaoes, setParticipacaoInstituicoes] = useState<ParticipacaoInstituicaoType[]>([]);

  const sincronizeParticipacaoInstituicoesQueue = async () => {
    if (moradorId > 0) {
      const queue = getParticipacoesIntitucionaisDessincronizadas(moradorId);

      if (queue.length > 0) {
        for (const participacaoInsituicao of queue) {
          const novoParticipacaoInstituicaoInput = convertToParticipacaoInstituicaoInput(participacaoInsituicao);
         console.log("participação enviada", novoParticipacaoInstituicaoInput)
           const isConnected = await testConnection();
            if (isConnected) {
              try {
                const response = await connectionAPIPost('http://192.168.100.28:8080/participacao-instituicao', novoParticipacaoInstituicaoInput);
                const participacaoInsituicaoAPI = response as ParticipacaoInstituicaoType;

                if (participacaoInsituicaoAPI.id) {
                   apagarParticipacaoInstituicaoQueue(participacaoInsituicao.idLocal!);
                }
              } catch (error) {
                //console.error('Erro na sincronização de participacaoInsituicao:', error);
              }
            }
          
        }
      }
    }
  };

  const fetchParticipacaoInstituicoesRealm = () => {
    const realmData = getParticipacoesIntitucionais(moradorId);
    console.log("aaaa", realmData)
    if (realmData.length > 0) {
      setParticipacaoInstituicoes((prev) => [...prev, ...realmData]);
    }
  };

          const fetchParticipacaoInstituicoesAPI = async () => {
            try {
              const response = await connectionAPIGet<ParticipacaoInstituicaoType[]>(`http://192.168.100.28:8080/participacao-instituicao/${moradorId}`);

             const participacaoData: ParticipacaoInstituicaoType[] = response.map(partcipacao => ({
                                       ...partcipacao,
                                       participacaoInsituicao: { id: partcipacao.morador.id }, // ajusta a estrutura
                                       sincronizado: true,
                                       idLocal: '', 
                                       idFather: '',
                                     }));
              if(participacaoData && Array.isArray(participacaoData) && participacaoData.length> 0){
                             await salvarParticipacoesIntitucionais(participacaoData)
                             const contagem = participacaoData.length;
                             setParticipacaoInstituicoes(participacaoData);
              } else {
                             throw new Error('Dados de participacaoInsituicaoes inválidos');
               }
            } catch (error) {
              //console.error('Erro ao recuperar participacaoInsituicaoes da API:', error);
            }
          };

  useEffect(() => {
    fetchParticipacaoInstituicoesRealm();
    fetchParticipacaoInstituicoesAPI();
    sincronizeParticipacaoInstituicoesQueue();
  }, []);

  return { participacaoInsituicaoes };
};
