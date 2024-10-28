import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
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
                const netInfoState = await NetInfo.fetch();
                if (netInfoState.isConnected) {
                    const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('http://192.168.100.28:8080/posto', novoPostoInput);
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
        }
    };

    const fetchPostosFromLocalDb = () => {
        const localData = getPostos(localidadeId);
        if (localData.length > 0) {
            const contagem = localData.length;
            setContagemPostos(contagem);
        }
    }

    const fetchPostosFromAPI = async () => {
        const netInfoState = await NetInfo.fetch();
        if (netInfoState.isConnected) {
            const isConnected = await testConnection();
            if (isConnected) {
                try {
                    const postosAPI = await connectionAPIGet<PostoType[]>(`http://192.168.100.28:8080/posto-de-saude/localidade-posto/${localidadeId}`);
                    const PostoData = postosAPI.map(posto => ({
                        ...posto,
                        sincronizado: true, 
                        idLocal: '',         
                    }));
                   
                    if (PostoData && Array.isArray(PostoData) && PostoData.length > 0) {
                        await salvarPostos(PostoData);
                        const contagem = PostoData.length;
                        setContagemPostos(contagem);
                    } else {
                        throw new Error('Dados de postos inválidos');
                    }
                } catch (error) {
                    console.log("CONTAGEM DE POSTOS-ERRO!!!:", error);
                }
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
