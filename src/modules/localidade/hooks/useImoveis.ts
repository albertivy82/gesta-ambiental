import NetInfo from "@react-native-community/netinfo";
import { getImoveis, getImoveisDessincronizados, salvarImoveis } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { useEffect, useState } from "react";
import { imovelBody } from "../../../shared/types/imovelType";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const useImoveis = (localidadeId: number) =>{
   const [contagemImoveis, setContagemImoveis] = useState<number>(0);
  
   
   const sinconizeQueue = async () => {
    const imovelQueue = getImoveisDessincronizados(localidadeId);
    if (imovelQueue.length > 0) {
        for (const imovel of imovelQueue) {
            const netInfoState = await NetInfo.fetch();
            if (netInfoState.isConnected) {
                const isConnected = await testConnection();
                if (isConnected) {
                    try {
                        const response = await connectionAPIPost('http://192.168.100.28:8080/imovel', imovel);
                        const imovelAPI = response as imovelBody;
                    } catch (error) {
                        console.error('Erro na sincronização do imóvel:', error);
                    }
                }
            }
        }
    }
};

   
   
   
   
   
   const fetchImoveisFromLocalDb = () =>{
      const localData = getImoveis(localidadeId);
            if (localData.length>0){
              const contagem = localData.length;
              setContagemImoveis(contagem);
            }
    }
   
   
   const fetchImoveisFromAPI = async () => {


     
      try {
          const imoveisAPI = await connectionAPIGet<imovelBody[]>(`http://192.168.100.28:8080/imovel/localidade-imovel/${localidadeId}`);
         const ImData = imoveisAPI.map(imovel => ({
              ...imovel,
              sincronizado: true, 
              idLocal: ""         
          }));
         
          if(ImData && Array.isArray(ImData) && ImData.length> 0){
               await salvarImoveis(ImData)
                const contagem = ImData.length;
                setContagemImoveis(contagem);
          } else {
                throw new Error('Dados de imóveis Inválidos');
          }

      } catch (error) {
        console.error("CONTAGEM DE IMOVEIS-ERRO!!!:", error);
      }
      
    };

    useEffect(()=>{
      fetchImoveisFromAPI();
      fetchImoveisFromLocalDb();
    }, []);
  
    return { contagemImoveis, sinconizeQueue};


}