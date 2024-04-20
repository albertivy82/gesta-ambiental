import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { apagarImovelQueue, getImoveis, getImoveisDessincronizados, salvarImoveis } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { imovelInput } from "../../../shared/types/imovelInput";
import { imovelBody } from "../../../shared/types/imovelType";
import { setIdImovelFromApi } from "../../../realm/services/benfeitoriaService";

export const convertToImovelInput=(imovel: any) => {

    
    const imovelInput: imovelInput ={
        rua: imovel.rua,
        numero: imovel.numero,
        bairro: imovel.bairro,
        referencial: imovel.referencial,
        latitude: imovel.latitude,
        longitude: imovel.longitude,
        areaImovel: imovel.areaImovel,
        vizinhos: imovel.vizinhos,
        situacaoFundiaria: imovel.situacaoFundiaria,
        documentacaoImovel: imovel.documentacaoImovel,
        dataChegada: imovel.dataChegada,
        pretendeMudar: imovel.pretendeMudar,
        motivoVontadeMudanca: imovel.motivoVontadeMudanca,
        relacaoArea: imovel.relacaoArea,
        relacaoVizinhos: imovel.relacaoVizinhos,
        limites: imovel.limites,
        iluminacaoPublica: imovel.iluminacaoPublica,
        transporte: imovel.transporte,
        programaInfraSaneamento: imovel.programaInfraSaneamento,
        linhasDeBarco: imovel.linhasDeBarco,
        tipoSolo: imovel.tipoSolo,
        esporteLazer: imovel.esporteLazer,
        localidade: {
            id: imovel.localidade
        }
    }

    console.log('imovelInput', imovelInput)
        return imovelInput
    };



export const useImoveis = (localidadeId: number) =>{
   const [contagemImoveis, setContagemImoveis] = useState<number>(0);
  
   
   const sinconizeQueue = async () => {
    const imovelQueue = getImoveisDessincronizados(localidadeId);
    if (imovelQueue.length > 0) {
        for (const imovel of imovelQueue) {
            const novoImoveIput = convertToImovelInput(imovel)
            console.log(novoImoveIput);
            const netInfoState = await NetInfo.fetch();
            if (netInfoState.isConnected) {
                const isConnected = await testConnection();
                if (isConnected) {
                    try {
                        const response = await connectionAPIPost('http://192.168.100.28:8080/imovel', novoImoveIput);
                        
                        const imovelAPI = response as imovelBody;
                       
                            if(imovelAPI.id){
                               //aqui ele vai dar uma pai no céu para todos os seus filhos
                                setIdImovelFromApi(imovelAPI.id, imovel.idLocal! )
                                //...Outros filhos de imovel
                                apagarImovelQueue(imovel.idLocal!)
                            }
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
              idLocal: '',         
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
      sinconizeQueue()
      fetchImoveisFromAPI();
      fetchImoveisFromLocalDb();
    }, []);
  
    return { contagemImoveis};


}