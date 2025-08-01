import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { setIdImovelFromApiOnBenfeitoria } from "../../../realm/services/benfeitoriaService";
import { apagarImovelQueue, getImoveisDessincronizados, getImovel, getTodosImoveis, salvarImoveis } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { imovelInput } from "../../../shared/types/imovelInput";
import { imovelBody } from "../../../shared/types/imovelType";
import { Alert } from "react-native";

export const convertToImovelInput = (imovel: any): imovelInput => {
  const imovelInput: imovelInput = {
      rua: imovel.rua,
      numero: imovel.numero,
      bairro: imovel.bairro,
      referencial: imovel.referencial,
      latitude: imovel.latitude,
      longitude: imovel.longitude,
      areaImovel: imovel.areaImovel,
      tipoSolo: imovel.tipoSolo,
      vizinhosConfinantes: imovel.vizinhosConfinantes,
      situacaoFundiaria: imovel.situacaoFundiaria,
      documentacaoImovel: imovel.documentacaoImovel,
      limites: imovel.limites,
      linhasDeBarco: imovel.linhasDeBarco,
      pavimentacao: imovel.pavimentacao,
      iluminacaoPublica: imovel.iluminacaoPublica,
      equipamentosUrbanos: imovel.equipamentosUrbanos, // corrigido aqui
      espacosEsporteLazer: imovel.espacosEsporteLazer,
      programaInfraSaneamento: imovel.programaInfraSaneamento,
      entrevistado: {
          id: imovel.entrevistado,
      },
  };

  return imovelInput;
};




export const useImovel = (idEntrevistado: number) => {
   const [imovelPresente, setImovelPresente] = useState<imovelBody>();
   
 const sinconizeImovelQueue = async () => {
 console.log(getTodosImoveis()) ;
      const imovelQueue = getImoveisDessincronizados(idEntrevistado);
     
      if (imovelQueue) {
        const novoImovelInput = convertToImovelInput(imovelQueue);
             
          const isConnected = await testConnection();
          if (isConnected) {
            try {
             
              const response = await connectionAPIPost('http://192.168.100.28:8080/imovel', novoImovelInput) as imovelBody;
             
              const imovelAPI = response as imovelBody;
              
              if (imovelAPI.id) {
                setIdImovelFromApiOnBenfeitoria(imovelAPI.id, imovelQueue.idLocal!);
                apagarImovelQueue(imovelAPI.idLocal!);
                
              }
            } catch (error: any) {
              if (error.response) {
                // Erro HTTP com resposta do servidor
                console.error("❌ Erro da API (HTTP 400 ou 500):");
                console.error("Status:", error.response.status);
                console.error("Headers:", error.response.headers);
                console.error("Body:", JSON.stringify(error.response.data, null, 2));
              } else if (error.request) {
                // Requisição enviada, mas sem resposta
                console.error("⚠️ Requisição enviada, mas sem resposta da API:");
                console.error(error.request);
              } else {
                // Erro de configuração, timeout, etc.
                console.error("❌ Erro inesperado no cliente:");
                console.error("Mensagem:", error.message);
                console.error("Erro completo:", error);
              }
            }
            
          }
        
      }
    };
  
    const fetchImovelRealm = () => {
      
      const imovelRealm = getImovel(idEntrevistado);
      if(imovelRealm){
        setImovelPresente(imovelRealm);
      }

      return imovelRealm;
    };
  
    const fetchImovelAPI = async () => {
      console.log('O QUE VEIO???');
      try {
        const response = await connectionAPIGet<imovelBody>(
          `http://192.168.100.28:8080/imovel/imovel-entrevistado/${idEntrevistado}`
        );

       
  
        if (response as imovelBody && response.id) {
          const imovelData: imovelBody = {
            ...response,
            sincronizado: true,
            idLocal: '',
            idFather: '',
          };
  
          await salvarImoveis(imovelData);
          setImovelPresente(imovelData); 
        } else {
          throw new Error('Dados de imóvel inválidos');
        }
      } catch (error) {
        console.log('Não foi possível recuperar Imóveis da Apí: '+ error);
      }
    };
  
    useEffect(() => {
      const syncAndFetch = async () => {
        await sinconizeImovelQueue(); // espera a sincronização terminar
        fetchImovelRealm();           // agora busca o dado atualizado do Realm
        await fetchImovelAPI();       // por fim, busca da API se necessário
      };
    
      syncAndFetch();
    }, []);
    

  return {imovelPresente};
};
  