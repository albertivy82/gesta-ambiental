import { useEffect, useRef, useState } from "react";
import { apagarPostoQueue, getPostos, getPostosDessincronizados, salvarPostos } from "../../../realm/services/postoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { PostoType } from "../../../shared/types/postoTypes";

export const convertToPostoInput = (posto: any) => {
    const postoInput = {
      nome: posto.nome,
      ambulatorial: posto.ambulatorial,
      urgenciaEmergencia: posto.urgenciaEmergencia,
      medicosPorTurno: posto.medicosPorTurno,
      localidade: {
        id: posto.localidade,
      },
    };
  
    console.log('postoInput na fila', postoInput);
    return postoInput;
};

export const usePostos = (localidadeId: number, foccus:boolean) => {
    const [postos, setPostos] = useState<PostoType[]>([]);
    const [contagemPostos, setContagemPostos] = useState<number>(0);
    const [loadingPostos, setLoadingPostos] = useState<boolean>(true);

    const syncingRef = useRef(false);

    const sinconizeQueue = async () => {
        const postosQueue = getPostosDessincronizados(localidadeId);
        if (postosQueue.length > 0) {
            for (const posto of postosQueue) {
                const novoPostoInput = convertToPostoInput(posto);
               
               const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('/api/posto-de-saude', novoPostoInput);
                            const postoAPI = response as PostoType;
                           
                            if (postoAPI.id) {
                               apagarPostoQueue(posto.idLocal!);
                            }
                        } catch (error) {
                            console.error('Erro na sincronização do posto:', error);
                        }
                    }
              
            }
        }
    };

    const fetchPostosFromLocalDb = () =>{
            const localData = getPostos(localidadeId);
            setPostos(localData);
            setContagemPostos(localData.length);
    }

    const fetchPostosFromAPI = async () => {

       
       
            const isConnected = await testConnection();
            if (isConnected) {
          try {
              const postosAPI = await connectionAPIGet<PostoType[]>(`/api/posto-de-saude/localidade-posto/${localidadeId}`);
              
              const postoData: PostoType[] = postosAPI.map(posto => ({
                ...posto,
                localidade: { id: posto.localidade.id }, // ajusta a estrutura
                sincronizado: true,
                idLocal: '', 
              }));
              

             if(postoData && Array.isArray(postoData) && postoData.length > 0){
                   await salvarPostos(postoData)
                   const contagem = postoData.length;
                   setContagemPostos(contagem);
              }
    
          } catch (error) {
            console.log("CONTAGEM DE POSTOS-ERRO!!!:", error);
          }
        }
          
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
          setLoadingPostos(true);
          await sinconizeQueue();
          await fetchPostosFromAPI();
          fetchPostosFromLocalDb();
        } finally {
          setLoadingPostos(false);
          syncingRef.current = false;
        }
      };

      sincronizarTudo();
    }, [foccus, localidadeId]);
  
    return { postos, contagemPostos, loadingPostos};
}
