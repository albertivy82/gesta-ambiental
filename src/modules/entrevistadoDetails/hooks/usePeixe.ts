import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { PeixesType } from "../../../shared/types/PeixesType";
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { apagarPeixeQueue, getPeixes, getPeixesDessincronizados, salvarPeixes } from "../../../realm/services/peixesService";

export const convertToPeixeInput = (peixe: any) => {
    const peixeInput: PeixesInput = {
        especie: peixe.especie,
        climaOcorrencia: peixe.climaOcorrencia,
        locaisEspecificosReproducao: peixe.locaisEspecificosReproducao,
        locaisEspecificosAlimentacao: peixe.locaisEspecificosAlimentacao,
        maisImportanteDaRegiao: peixe.maisImportanteDaRegiao,
        usosDaEspecie: peixe.usosDaEspecie,
        entrevistado: {
            id: peixe.entrevistado, 
        },
    };
    return peixeInput;
};

export const usePeixes = (entrevistadoId: number) => {
    const [peixes, setPeixes] = useState<PeixesType[]>([]);

    const sincronizePeixeQueue = async () => {
        if (entrevistadoId > 0) {
            const peixeQueue = getPeixesDessincronizados(entrevistadoId);
            
            if (peixeQueue.length > 0) {
                for (const peixe of peixeQueue) {
                    const novoPeixeInput = convertToPeixeInput(peixe);
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/peixe', novoPeixeInput);
                                const peixeAPI = response as PeixesType;

                                if (peixeAPI.id) {
                                    apagarPeixeQueue(peixe.idLocal!);
                                }
                            } catch (error) {
                                console.log('Erro na sincronização do peixe:', error);
                            }
                        }
                    }
                }
            }
        }
    };

    const fetchPeixesRealm = () => {
            const peixesRealm = getPeixes(entrevistadoId);
            if (peixesRealm.length > 0) {
               setPeixes((prevPeixes) => [...prevPeixes, ...peixesRealm]); // Aqui usamos peixesRealm
            }
   };
        

    const fetchPeixesAPI = async () => {
        try {
            const response = await connectionAPIGet<PeixesType[]>(`http://192.168.100.28:8080/peixe/entrevistado-peixe/${entrevistadoId}`);
            const peixesData = response.map(peixe => ({
                ...peixe,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
            
            if (peixesData && Array.isArray(peixesData) && peixesData.length > 0) {
                await salvarPeixes(peixesData);
                setPeixes((prevPeixes) => [...prevPeixes, ...peixesData]);
            } else {
                throw new Error('Dados de peixe inválidos');
            }
        } catch (error) {
            console.log("Erro ao recuperar peixes da API:", error);
        }
    };

    useEffect(() => {
        fetchPeixesRealm();
        fetchPeixesAPI();
        sincronizePeixeQueue();
    }, []);

    return { peixes };
};
