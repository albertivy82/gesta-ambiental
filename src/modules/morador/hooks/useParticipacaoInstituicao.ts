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

export const useParticipacaoInstituicoes = (moradorId: number, foccus: boolean) => {
  const [participacaoInsituicaoes, setParticipacaoInstituicoes] = useState<ParticipacaoInstituicaoType[]>([]);

  const sincronizeParticipacaoInstituicoesQueue = async () => {
    if (moradorId > 0) {
      const queue = getParticipacoesIntitucionaisDessincronizadas(moradorId);

      if (queue.length > 0) {
        for (const participacaoInsituicao of queue) {
          const novoParticipacaoInstituicaoInput = convertToParticipacaoInstituicaoInput(participacaoInsituicao);
         console.log("participação enviada1", novoParticipacaoInstituicaoInput)
           const isConnected = await testConnection();
           console.log("participação enviada2", novoParticipacaoInstituicaoInput)
            if (isConnected) {
              console.log("participação enviada3", novoParticipacaoInstituicaoInput)
              try {
                const response = await connectionAPIPost('http://177.74.56.24/participacao-instituicao', novoParticipacaoInstituicaoInput);
                const participacaoInsituicaoAPI = response as ParticipacaoInstituicaoType;
                console.log("participação enviada4", participacaoInsituicaoAPI)
                if (participacaoInsituicaoAPI.id) {
                   apagarParticipacaoInstituicaoQueue(participacaoInsituicao.idLocal!);
                }
              } catch (error) {
                console.error('Erro na sincronização de participacaoInsituicao:', error);
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
      setParticipacaoInstituicoes(realmData);
    }
  };

          const fetchParticipacaoInstituicoesAPI = async () => {
            try {
              const response = await connectionAPIGet<ParticipacaoInstituicaoType[]>(`http://177.74.56.24/participacao-instituicao/morador-pariticipacao-instituicao/${moradorId}`);
             console.log("baixando da api", response)
             const ptcData = response.map(ptcData=>({
                                 ...ptcData,
                                 sincronizado:true,
                                 idLocal:'',
                                 idFather:'',
             
                             }))
                           //  console.log("benfeitpria. circuito da API")    
                             if(ptcData && Array.isArray(ptcData) && ptcData.length>0){
                                   await salvarParticipacoesIntitucionais(ptcData);
                                    setParticipacaoInstituicoes((prevptcData) => [...prevptcData, ...ptcData]);
                             }else{
                                 throw new Error('Dados de benfeitoria Inválidos'); 
                             }
             
            } catch (error) {
              //console.error('Erro ao recuperar participacaoInsituicaoes da API:', error);
            }
          };

  useEffect(() => {
    sincronizeParticipacaoInstituicoesQueue();
    fetchParticipacaoInstituicoesAPI();
    fetchParticipacaoInstituicoesRealm();
    
  }, [foccus]);

  return { participacaoInsituicaoes };
};
