import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { FaunaInput } from "../../../shared/types/FaunaInput";
import { apagarFaunaQueue, getFauna, getFaunaDessincronizadas, salvarFauna } from "../../../realm/services/faunaService";
import { FaunaType } from "../../../shared/types/FaunaType";

export const convertToFaunaInput = (fauna: any) => {
    const faunaInput: FaunaInput = {
        especie: fauna.especie,
        ocorreMata: fauna.ocorreMata,
        ocorreRio: fauna.ocorreRio,
        ocorreLago: fauna.ocorreLago,
        ocorreRua: fauna.ocorreRua,
        ocorreQuintal: fauna.ocorreQuintal,
        outrasOcorrencias: fauna.outrasOcorrencias,
        frequenciaAtual: fauna.frequenciaAtual,
        frequenciaPassada: fauna.frequenciaPassada,
        tempoQueNaoVe: fauna.tempoQueNaoVe,
        entrevistado: {
            id: fauna.entrevistado.id, 
        },
    };
    return faunaInput;
};

export const useFauna = (entrevistadoId: number) => {
    const [fauna, setFauna] = useState<FaunaInput[]>([]);

    const sincronizeFaunaQueue = async () => {
        if (entrevistadoId > 0) {
            const faunaQueue = getFaunaDessincronizadas(entrevistadoId);
            
            if (faunaQueue.length > 0) {
                for (const fauna of faunaQueue) {
                    const novaFaunaInput = convertToFaunaInput(fauna);
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/fauna', novaFaunaInput);
                                const faunaAPI = response as FaunaType;

                                if (faunaAPI.id) {
                                    apagarFaunaQueue(fauna.idLocal!);
                                }
                            } catch (error) {
                                console.error('Erro na sincronização da fauna:', error);
                            }
                        }
                    }
                }
            }
        }
    };

 const fetchFaunaRealm = () => {
         const faunaRealm = getFauna(entrevistadoId);
         if (faunaRealm.length > 0) {
            setFauna((prevFauna) => [...prevFauna, ...faunaRealm]); // Aqui usamos faunaRealm
         }
     };

    const fetchFaunaAPI = async () => {
        try {
            const response = await connectionAPIGet<FaunaType[]>(`http://192.168.100.28:8080/fauna/entrevistado-fauna/${entrevistadoId}`);
            const faunaData = response.map(fauna => ({
                ...fauna,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
            
            if (faunaData && Array.isArray(faunaData) && faunaData.length > 0) {
                await salvarFauna(faunaData);
                setFauna((prevFauna) => [...prevFauna, ...faunaData]);
            } else {
                throw new Error('Dados de fauna inválidos');
            }
        } catch (error) {
            console.error("Erro ao recuperar fauna da API:", error);
        }
    };

    useEffect(() => {
        fetchFaunaRealm();
        fetchFaunaAPI();
        sincronizeFaunaQueue();
    }, []);

    return { fauna };
};
