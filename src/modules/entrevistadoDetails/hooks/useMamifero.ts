import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarMamiferoQueue, getMamiferosDessincronizados, getMamiferos,  salvarMamiferos } from "../../../realm/services/mamiferosService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { MamiferosInput } from "../../../shared/types/MamiferosInput";
import { MamiferosType } from "../../../shared/types/MamiferosType";

export const convertToMamiferoInput = (mamifero: any) => {
    const mamiferoInput: MamiferosInput = {
        especie: mamifero.especie,
        local: mamifero.usoConsumo,
        usoDaEspecie: mamifero.usoComercio,
        problemasGerados: mamifero.usoCriacao,
        alimentacao: mamifero.usoRemedio,
        desricaoEspontanea: mamifero.usoOutros,
        entrevistado: {
            id: mamifero.entrevistado, 
        },
    };
    return mamiferoInput;
};

export const useMamiferos = (entrevistadoId: number) => {
    const [mamiferos, setMamiferos] = useState<MamiferosType[]>([]);

    const sincronizeMamiferoQueue = async () => {
        if (entrevistadoId > 0) {
            const mamiferoQueue = getMamiferosDessincronizados(entrevistadoId);
            
            if (mamiferoQueue.length > 0) {
                for (const mamifero of mamiferoQueue) {
                    const novoMamiferoInput = convertToMamiferoInput(mamifero);
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/mamifero', novoMamiferoInput);
                                const mamiferoAPI = response as MamiferosType;

                                if (mamiferoAPI.id) {
                                    apagarMamiferoQueue(mamifero.idLocal!);
                                }
                            } catch (error) {
                                console.log('Erro na sincronização do mamífero:', error);
                            }
                        }
                    }
                }
            }
        }
    };

     const fetchMamiferosRealm = () => {
           const mamiferosRealm = getMamiferos(entrevistadoId);
           if (mamiferosRealm.length > 0) {
              setMamiferos((prevMamiferos) => [...prevMamiferos, ...mamiferosRealm]); // Aqui usamos mamiferosRealm
           }
       };

    const fetchMamiferosAPI = async () => {
        try {
            const response = await connectionAPIGet<MamiferosType[]>(`http://192.168.100.28:8080/mamifero/entrevistado-mamifero/${entrevistadoId}`);
            const mamiferosData = response.map(mamifero => ({
                ...mamifero,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
            
            if (mamiferosData && Array.isArray(mamiferosData) && mamiferosData.length > 0) {
               await salvarMamiferos(mamiferosData);
               setMamiferos((prevMamiferos) => [...prevMamiferos, ...mamiferosData]);
            } else {
                throw new Error('Dados de mamífero inválidos');
            }
        } catch (error) {
            console.log("Erro ao recuperar mamíferos da API:", error);
        }
    };

    useEffect(() => {
        fetchMamiferosRealm();
        fetchMamiferosAPI();
        sincronizeMamiferoQueue();
    }, []);

    return { mamiferos };
};
