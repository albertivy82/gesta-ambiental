import { salvarImoveis } from "../../../realm/services/imovelService";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { useEffect, useState } from "react";
import { imovelBody } from "../../../shared/types/imovelBody";

export const useImoveis = (localidadeId: number) =>{
   const [contagemImoveis, setContagemImoveis] = useState<number>(0);
  
    const fetchImoveis = async () => {
     
      try {
        const imoveisAPI = await connectionAPIGet(`http://192.168.100.28:8080/imoveis/${localidadeId}`);

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
      fetchImoveis();
    }, []);
  
    return { fetchImoveis, contagemImoveis };


}