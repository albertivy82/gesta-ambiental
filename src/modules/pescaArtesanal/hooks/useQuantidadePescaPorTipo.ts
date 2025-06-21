import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarPescaPorTipoQueue, getQtdPescaPorTipoPesca, getQuantidadesPescaPorTipoDessincronizados, salvarQtdPescaPorTipoPesca } from "../../../realm/services/quantidadePescaPorTipoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { QuantidadePescaPorTipoType } from "../../../shared/types/QuantidadePescaPorTipoType";
import { QuantidadePescaPorTipoInput } from "../../../shared/types/QuantidadePescaPorTipoTypeInput";

export const convertToQuantidadePescaPorTipoInput = (quantidadePescaPorTipo: any) => {
    
    const quantidadePescaPorTipoInput: QuantidadePescaPorTipoInput = {
        tipoPesca: quantidadePescaPorTipo.finalidade,
        quantidadePesca: quantidadePescaPorTipo.usoMedicinal,
        pescaArtesanal: {
            id: quantidadePescaPorTipo.pescaArtesanal, 
        }
    };

    return quantidadePescaPorTipoInput;
};

export const useQuantidadesPescaPorTipo = (pescaArtesanalId: number) => {
    const [quantidadePescaPorTipo, setQuantidadePescaPorTipo] = useState<QuantidadePescaPorTipoType[]>([]);

    const sincronizarQuantidadePescaPorTipoQueue = async () => {
        if (pescaArtesanalId > 0) {
           
            const quantidadesPescaPorTipoQueue = getQuantidadesPescaPorTipoDessincronizados(pescaArtesanalId);
           
            if (quantidadesPescaPorTipoQueue.length > 0) {
                for (const quantidadePescaPorTipo of quantidadesPescaPorTipoQueue) {
                    const novaQuantidadePescaPorTipoInput = convertToQuantidadePescaPorTipoInput(quantidadePescaPorTipo);
                    console.log("useQuantidadesPescaPorTipo/novaQuantidadePescaPorTipoInput", novaQuantidadePescaPorTipoInput );
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/quantidade-pesca-por-tipo', novaQuantidadePescaPorTipoInput);
                                const quantidadePescaPorTipoAPI = response as QuantidadePescaPorTipoType;

                                if (quantidadePescaPorTipoAPI.id) {
                                    apagarPescaPorTipoQueue(quantidadePescaPorTipo.idLocal!);
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

   const fetchQuantidadePescaPorTipoRealm = () => {
           const quantidadePescaPorTipoRealm = getQtdPescaPorTipoPesca(pescaArtesanalId);
           if (quantidadePescaPorTipoRealm.length > 0) {
           setQuantidadePescaPorTipo((prevQuantidadePescaPorTipo) => [...prevQuantidadePescaPorTipo, ...quantidadePescaPorTipoRealm]); // Aqui usamos quantidadePescaPorTipoRealm
           }
    };
       

    const fetchQuantidadesPescaPorTipoAPI = async () => {
        try {
            const response = await connectionAPIGet<QuantidadePescaPorTipoType[]>(`http://192.168.100.28:8080/quantidade-pesca-por-tipo/pesca-artesanal-quantidade-pesca-por-tipo/${pescaArtesanalId}`);
            const quantidadePescaPorTipoData = response.map(veg => ({
                ...veg,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
           if (quantidadePescaPorTipoData && Array.isArray(quantidadePescaPorTipoData) && quantidadePescaPorTipoData.length > 0) {
                await salvarQtdPescaPorTipoPesca(quantidadePescaPorTipoData);
                 setQuantidadePescaPorTipo((prevQuantidadePescaPorTipo) => [...prevQuantidadePescaPorTipo, ...quantidadePescaPorTipoData]);
            } else {
                throw new Error('Dados de vegetação inválidos');
            }
        } catch (error) {
            // console.log("CONTAGEM DE VEGETAÇÕES - ERRO!!!:", error);
        }
    };

    useEffect(() => {
        fetchQuantidadePescaPorTipoRealm();
        fetchQuantidadesPescaPorTipoAPI();
        sincronizarQuantidadePescaPorTipoQueue();
    }, []);

    return { quantidadePescaPorTipo };
};
