import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { RepteisInput } from "../../../shared/types/RepteisInput";
import { RepteisType } from "../../../shared/types/RepteisType";
import { apagarReptilQueue, getRepteis, getRepteisDessincronizadas, salvarRepteis } from "../../../realm/services/repteisService";

export const convertToReptilInput = (reptil: any) => {
    const reptilInput: RepteisInput = {
        especie: reptil.especie,
        local: reptil,
        periodo: reptil,
        uso: reptil,
        ameacado: reptil,
        problemasRelacionados: reptil,
        cacado: reptil,
        descricaoEspontanea: reptil,
        entrevistado: {
          id: 0,
        },
    };
    return reptilInput;
};

export const useReptils = (entrevistadoId: number) => {
    const [reptils, setReptils] = useState<RepteisType[]>([]);

    const sincronizeReptilQueue = async () => {
        if (entrevistadoId > 0) {
            const reptilQueue = getRepteisDessincronizadas(entrevistadoId);
            
            if (reptilQueue.length > 0) {
                for (const reptil of reptilQueue) {
                    const novoReptilInput = convertToReptilInput(reptil);
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/reptil', novoReptilInput);
                                const reptilAPI = response as RepteisType;

                                if (reptilAPI.id) {
                                    apagarReptilQueue(reptil.idLocal!);
                                }
                            } catch (error) {
                                console.log('Erro na sincronização do reptil:', error);
                            }
                        }
                    }
                }
            }
        }
    };

    const fetchReptilsRealm = () => {
            const reptilsRealm = getRepteis(entrevistadoId);
            if (reptilsRealm.length > 0) {
               setReptils((prevReptils) => [...prevReptils, ...reptilsRealm]); // Aqui usamos reptilsRealm
            }
   };
        

    const fetchReptilsAPI = async () => {
        try {
            const response = await connectionAPIGet<RepteisType[]>(`http://192.168.100.28:8080/reptil/entrevistado-reptil/${entrevistadoId}`);
            const reptilsData = response.map(reptil => ({
                ...reptil,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
            
            if (reptilsData && Array.isArray(reptilsData) && reptilsData.length > 0) {
                await salvarRepteis(reptilsData);
                setReptils((prevReptils) => [...prevReptils, ...reptilsData]);
            } else {
                throw new Error('Dados de reptil inválidos');
            }
        } catch (error) {
            console.log("Erro ao recuperar reptils da API:", error);
        }
    };

    useEffect(() => {
        fetchReptilsRealm();
        fetchReptilsAPI();
        sincronizeReptilQueue();
    }, []);

    return { reptils };
};
