import { useEffect, useState } from "react";
import { apagarMoradorQueue, getMoradores, getMoradoresDessincronizados, salvarMoradores } from "../../../realm/services/moradorService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { MoradorInput } from "../../../shared/types/MoradorInput";
import { MoradorType } from "../../../shared/types/MoradorType";
import { setIdEntrevitadoFromApiOnParticipacaoInstituicao } from "../../../realm/services/ParticipacaoInstituicaoService";

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
  const [loadingMoradores, setLoadingMoradores] = useState<boolean>(true);
  const [moradores, setMoradores] = useState<MoradorType[]>([]);

  const sincronizeMoradoresQueue = async () => {
    if (benfeitoriaId > 0) {
      const queue = getMoradoresDessincronizados(benfeitoriaId);
      if (queue.length > 0) {
        for (const morador of queue) {
          const novoMoradorInput = convertToMoradorInput(morador);
         
       
            const isConnected = await testConnection();
            if (isConnected) {
              try {
                const response = await connectionAPIPost('http://177.74.56.24/morador', novoMoradorInput);
                
                const moradorAPI = response as MoradorType;
              
                if (moradorAPI.id) {
                  const upadated = setIdEntrevitadoFromApiOnParticipacaoInstituicao(moradorAPI.id, morador.idLocal!)
                      if (upadated){apagarMoradorQueue(morador.idLocal!)};
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
    setMoradores(realmData);
  };

  const fetchMoradoresAPI = async () => {

    const isConnected = await testConnection();
    

    if (isConnected) {
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
           } else {
            throw new Error('Dados de moradores inválidos');
          }
        } catch (error) {
          //console.error('Erro ao recuperar moradores da API:', error);
        }
      }
  };


  useEffect(() => {
    const sincronizarTudo = async () => {
      setLoadingMoradores(true);
        await sincronizeMoradoresQueue();
        await fetchMoradoresAPI();
        fetchMoradoresRealm();
      setLoadingMoradores(false);
  };
  sincronizarTudo();
  }, [foccus]);

  return { moradores, loadingMoradores };
};
