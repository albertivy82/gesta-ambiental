import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EmbarcacaoInput } from "../../../shared/types/EmbarcacaoInput";
import { EmbarcacaoType } from "../../../shared/types/EmbarcacaoType";
import { apagarEmbarcacaoQueue, getEmbarcacoes, getEmbarcacoesDessincronizadas, salvarEmbarcacoes } from "../../../realm/services/embarcacaoService";

export const convertToEmbarcacaoInput = (embarcacao: any) => {
    
    const embarcacaoInput: EmbarcacaoInput = {
        numeracao: embarcacao.finalidade,
        tipoBarco: embarcacao.usoMedicinal,
        tipoCasco: embarcacao.usoAlimentacao,
        pescaArtesanal: {
            id: embarcacao.pescaArtesanal, 
        }
    };

    return embarcacaoInput;
};

export const useEmbarcacoes = (pescaArtesanalId: number) => {
    const [embarcacao, setEmbarcacao] = useState<EmbarcacaoType[]>([]);

    const sincronizarEmbarcacaoQueue = async () => {
        if (pescaArtesanalId > 0) {
           
            const embarcacoesQueue = getEmbarcacoesDessincronizadas(pescaArtesanalId);
           
            if (embarcacoesQueue.length > 0) {
                for (const embarcacao of embarcacoesQueue) {
                    const novaEmbarcacaoInput = convertToEmbarcacaoInput(embarcacao);
                    console.log("useEmbarcacoes/novaEmbarcacaoInput", novaEmbarcacaoInput );
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/embarcacao', novaEmbarcacaoInput);
                                const embarcacaoAPI = response as EmbarcacaoType;

                                if (embarcacaoAPI.id) {
                                    apagarEmbarcacaoQueue(embarcacao.idLocal!);
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

   const fetchEmbarcacaoRealm = () => {
           const embarcacaoRealm = getEmbarcacoes(pescaArtesanalId);
           if (embarcacaoRealm.length > 0) {
           setEmbarcacao((prevEmbarcacao) => [...prevEmbarcacao, ...embarcacaoRealm]); // Aqui usamos embarcacaoRealm
           }
    };
       

    const fetchEmbarcacoesAPI = async () => {
        try {
            const response = await connectionAPIGet<EmbarcacaoType[]>(`http://192.168.100.28:8080/embarcacao/pesca-artesanal-embarcacao/${pescaArtesanalId}`);
            const embarcacaoData = response.map(veg => ({
                ...veg,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
           if (embarcacaoData && Array.isArray(embarcacaoData) && embarcacaoData.length > 0) {
                await salvarEmbarcacoes(embarcacaoData);
                 setEmbarcacao((prevEmbarcacao) => [...prevEmbarcacao, ...embarcacaoData]);
            } else {
                throw new Error('Dados de vegetação inválidos');
            }
        } catch (error) {
            // console.log("CONTAGEM DE VEGETAÇÕES - ERRO!!!:", error);
        }
    };

    useEffect(() => {
        fetchEmbarcacaoRealm();
        fetchEmbarcacoesAPI();
        sincronizarEmbarcacaoQueue();
    }, []);

    return { embarcacao };
};
