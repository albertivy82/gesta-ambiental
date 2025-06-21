import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EspecieInput } from "../../../shared/types/EspecieInput";
import { EspecieType } from "../../../shared/types/EspecieType";
import { apagarEspecieQueue, getEspecies, getEspeciesDessincronizados, salvarEspecies } from "../../../realm/services/especieService";


export const convertToEspecieInput = (especie: any) => {
    
    const especieInput: EspecieInput = {
        especie: especie.especie,
        quantidadePescada: especie.quantidadePescada,
        tamanhoDaPesca: especie.tamanhoDaPesca,
        exploracaoNivel: especie.exploracaoNivel,
        precoVendaMedioKg: especie.precoVendaMedioKg,
        quantidadeDaPesca: especie.quantidadeDaPesca,
        importancia: especie.importancia,
        mesesMaiorOcorrencia: especie.mesesMaiorOcorrencia,
        pescaArtesanal: {
            id: especie.pescaArtesanal, 
        }
    };

    return especieInput;
};

export const useEspecies = (pescaArtesanalId: number) => {
    const [especie, setEspecie] = useState<EspecieType[]>([]);

    const sincronizarEspecieQueue = async () => {
        if (pescaArtesanalId > 0) {
           
            const especiesQueue = getEspeciesDessincronizados(pescaArtesanalId);
           
            if (especiesQueue.length > 0) {
                for (const especie of especiesQueue) {
                    const novaEspecieInput = convertToEspecieInput(especie);
                    console.log("useEspecies/novaEspecieInput", novaEspecieInput );
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/especie', novaEspecieInput);
                                const especieAPI = response as EspecieType;

                                if (especieAPI.id) {
                                    apagarEspecieQueue(especie.idLocal!);
                                }
                            } catch (error) {
                                // console.log('Erro na sincronização da vegetação:', error);
                            }
                        }
                    }
                }
            }
        }
    };

   const fetchEspecieRealm = () => {
           const especieRealm = getEspecies(pescaArtesanalId);
           if (especieRealm.length > 0) {
           setEspecie((prevEspecie) => [...prevEspecie, ...especieRealm]); // Aqui usamos especieRealm
           }
    };
       

    const fetchEspeciesAPI = async () => {
        try {
            const response = await connectionAPIGet<EspecieType[]>(`http://192.168.100.28:8080/especie/pesca-artesanal-especie/${pescaArtesanalId}`);
            const especieData = response.map(veg => ({
                ...veg,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
           if (especieData && Array.isArray(especieData) && especieData.length > 0) {
                await salvarEspecies(especieData);
                 setEspecie((prevEspecie) => [...prevEspecie, ...especieData]);
            } else {
                throw new Error('Dados de vegetação inválidos');
            }
        } catch (error) {
            // console.log("CONTAGEM DE VEGETAÇÕES - ERRO!!!:", error);
        }
    };

    useEffect(() => {
        fetchEspecieRealm();
        fetchEspeciesAPI();
        sincronizarEspecieQueue();
    }, []);

    return { especie };
};
