import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {apagarAveQueue, getAves, getAvesDessincronizadas, salvarAves } from "../../../realm/services/avesService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AvesInput } from "../../../shared/types/AvesInput";
import { AvesType } from "../../../shared/types/AvesType";

export const convertToAvesInput = (ave: any) => {
    const avesInput: AvesInput = {
        especie: ave.especie,
        climaOcorrencia: ave.useCosumo,
        usosDaEspecie: ave.usoComercio,
        localDeAglomeracao: ave.usoCriacao,
        problemasGerados: ave.usoRemedio,
        ameacaSofrida: ave.usoOutros,
        entrevistado: {
            id: ave.entrevistado, 
        },
    };
    return avesInput;
};

export const useAves = (entrevistadoId: number) => {
    const [aves, setAves] = useState<AvesType[]>([]);


    const sincronizeAvesQueue = async () => {
        if (entrevistadoId > 0) {
            const avesQueue = getAvesDessincronizadas(entrevistadoId);
            
            if (avesQueue.length > 0) {
                for (const ave of avesQueue) {
                    const novaAvesInput = convertToAvesInput(ave);
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/aves', novaAvesInput);
                                const avesAPI = response as AvesType;

                                if (avesAPI.id) {
                                    apagarAveQueue(ave.idLocal!);
                                }
                            } catch (error) {
                                console.log('Erro na sincronização das aves:', error);
                            }
                        }
                    }
                }
            }
        }
    };

    const fetchAvesRealm = () => {
        const avesRealm = getAves(entrevistadoId);
        if (avesRealm.length > 0) {
           setAves((prevAves) => [...prevAves, ...avesRealm]); // Aqui usamos avesRealm
        }
    };
    

    const fetchAvesAPI = async () => {
        try {
            const response = await connectionAPIGet<AvesType[]>(`http://192.168.100.28:8080/ave/entrevistado-ave/${entrevistadoId}`);
            const avesData = response.map(ave => ({
                ...ave,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
            
            if (avesData && Array.isArray(avesData) && avesData.length > 0) {
                await salvarAves(avesData);
                setAves((prevAves) => [...prevAves, ...avesData]);
                
            } else {
                throw new Error('Dados de aves inválidos');
            }
        } catch (error) {
            console.log("Erro ao recuperar aves da API:", error);
        }
    };

    useEffect(() => {
        fetchAvesRealm();
        fetchAvesAPI();
        sincronizeAvesQueue();
    }, []);

    return { aves };
};
