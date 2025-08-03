import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarPostoQueue, getPostos, getPostosDessincronizados, salvarPostos, salvarPostoSaudeQueue } from "../../../realm/services/postoService";
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
  
    console.log('postoInput', postoInput);
    return postoInput;
};

export const usePostos = (localidadeId: number) => {
    const [contagemPostos, setContagemPostos] = useState<number>(0);

    const sinconizeQueue = async () => {
        const postosQueue = getPostosDessincronizados(localidadeId);
        if (postosQueue.length > 0) {
            for (const posto of postosQueue) {
                const novoPostoInput = convertToPostoInput(posto);
               
               const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('http://177.74.56.24/posto', novoPostoInput);
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
                  if (localData.length>0){
                    const contagem = localData.length;
                    setContagemPostos(contagem);
                  }
    }

    const fetchPostosFromAPI = async () => {

       
       
            const isConnected = await testConnection();
            if (isConnected) {
          try {
              const postosAPI = await connectionAPIGet<PostoType[]>(`http://177.74.56.24/posto-de-saude/localidade-posto/${localidadeId}`);
              
              const postoData: PostoType[] = postosAPI.map(posto => ({
                ...posto,
                localidade: { id: posto.localidade.id }, // ajusta a estrutura
                sincronizado: true,
                idLocal: '', 
              }));
              

             if(postoData && Array.isArray(postoData) && postoData.length> 0){
                   await salvarPostos(postoData)
                   const contagem = postoData.length;
                   setContagemPostos(contagem);
              } else {
                    throw new Error('Dados de postos Inválidos');
              }
    
          } catch (error) {
            console.log("CONTAGEM DE POSTOS-ERRO!!!:", error);
          }
        }
          
    };

    useEffect(() => {
        sinconizeQueue();
        fetchPostosFromAPI();
        fetchPostosFromLocalDb();
    }, []);
  
    return { contagemPostos };
}
