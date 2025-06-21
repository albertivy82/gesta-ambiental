import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { DestinoPescaInput } from "../../../shared/types/DestinoPescaInput";
import { DestinoPescaType } from "../../../shared/types/DestinoPescaType";
import { apagarDestinoPescaQueue, getDestinosPesca, getDestinosPescaDessincronizados, salvarDestinosPesca } from "../../../realm/services/destinoPescaService";


export const convertToDestinoPescaInput = (destinoPesca: any) => {
    
    const destinoPescaInput: DestinoPescaInput = {
        finalidade: destinoPesca.finalidade,
        quantidade: destinoPesca.usoMedicinal,
        destino: destinoPesca.usoAlimentacao,
        destinoFixo: destinoPesca.usoOrnamental,
        paraQuantos: destinoPesca.paraQuantos,
         pescaArtesanal: {
            id: destinoPesca.pescaArtesanal, 
        }
    };

    return destinoPescaInput;
};

export const useDestinosPesca = (pescaArtesanalId: number) => {
    const [destinoPesca, setDestinoPesca] = useState<DestinoPescaType[]>([]);

    const sincronizarDestinoPescaQueue = async () => {
        if (pescaArtesanalId > 0) {
           
            const destinosPescaQueue = getDestinosPescaDessincronizados(pescaArtesanalId);
           
            if (destinosPescaQueue.length > 0) {
                for (const destinoPesca of destinosPescaQueue) {
                    const novaDestinoPescaInput = convertToDestinoPescaInput(destinoPesca);
                    console.log("useDestinosPesca/novaDestinoPescaInput", novaDestinoPescaInput );
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/destino-pesca', novaDestinoPescaInput);
                                const destinoPescaAPI = response as DestinoPescaType;

                                if (destinoPescaAPI.id) {
                                    apagarDestinoPescaQueue(destinoPesca.idLocal!);
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

   const fetchDestinoPescaRealm = () => {
           const destinoPescaRealm = getDestinosPesca(pescaArtesanalId);
           if (destinoPescaRealm.length > 0) {
           setDestinoPesca((prevDestinoPesca) => [...prevDestinoPesca, ...destinoPescaRealm]); // Aqui usamos destinoPescaRealm
           }
    };
       

    const fetchDestinosPescaAPI = async () => {
        try {
            const response = await connectionAPIGet<DestinoPescaType[]>(`http://192.168.100.28:8080/destino-pesca/pesca-artesanal-destino-pesca/${pescaArtesanalId}`);
            const destinoPescaData = response.map(veg => ({
                ...veg,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
           if (destinoPescaData && Array.isArray(destinoPescaData) && destinoPescaData.length > 0) {
                await salvarDestinosPesca(destinoPescaData);
                 setDestinoPesca((prevDestinoPesca) => [...prevDestinoPesca, ...destinoPescaData]);
            } else {
                throw new Error('Dados de vegetação inválidos');
            }
        } catch (error) {
            // console.log("CONTAGEM DE VEGETAÇÕES - ERRO!!!:", error);
        }
    };

    useEffect(() => {
        fetchDestinoPescaRealm();
        fetchDestinosPescaAPI();
        sincronizarDestinoPescaQueue();
    }, []);

    return { destinoPesca };
};
