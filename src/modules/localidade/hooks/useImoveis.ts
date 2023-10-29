import { getImoveis, salvarImoveis } from "../../../realm/services/imovelService";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { useEffect, useState } from "react";
import { imovelBody } from "../../../shared/types/imovelBody";

export const useImoveis = (localidadeId: number) =>{
   const [contagemImoveis, setContagemImoveis] = useState<number>(0);
  
    const fetchImoveisFromLocalDb = () =>{
      const localData = getImoveis(localidadeId);
            if (localData.length>0){
              const contagem = localData.length;
              setContagemImoveis(contagem);
            }
    }
   
   
   const fetchImoveisFromAPI = async () => {
     
      try {
          const imoveisAPI = await connectionAPIGet(`http://192.168.100.28:8080/imovel/localidade-imovel/${localidadeId}`);
          const ImData =  imoveisAPI as imovelBody[];
         
          if(ImData && Array.isArray(ImData) && ImData.length> 0){
                await salvarImoveis(imoveisAPI as imovelBody[])
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
  
    return { contagemImoveis };


}