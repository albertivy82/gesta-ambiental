import { useEffect, useRef, useState } from "react";
import { setIdImovelFromApiOnBenfeitoria } from "../../../realm/services/benfeitoriaService";
import { apagarImovelQueue, getImoveisDessincronizados, getImovel, getTodosImoveis, salvarImoveis } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { imovelInput } from "../../../shared/types/imovelInput";
import { imovelBody } from "../../../shared/types/imovelType";



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
      linhasOnibus: imovel.linhasOnibus,
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








export const useImovel = (idEntrevistado: number, foccus:boolean) => {
   const [loadingImovel, setLoadingImovel] = useState<boolean>(true);
   const [imovelPresente, setImovelPresente] = useState<imovelBody>();
   const syncingRef = useRef(false);
   
 const sinconizeImovelQueue = async () => {


    if(idEntrevistado>0){
      const imovelQueue = getImoveisDessincronizados(idEntrevistado);
   
      if (imovelQueue) {
       
        const novoImovelInput = convertToImovelInput(imovelQueue);
          const isConnected = await testConnection();
          if (isConnected) {
            try {
             
              const response = await connectionAPIPost('http://192.168.100.28:8080/imovel', novoImovelInput) as imovelBody;
              const imovelAPI = response as imovelBody;
             
              if (imovelAPI.id && imovelQueue.idLocal) {
                const updated =  setIdImovelFromApiOnBenfeitoria(imovelAPI.id, imovelQueue.idLocal!);
                  if(updated){
                    apagarImovelQueue(imovelQueue.idLocal!);
                  }
               
              }
            } catch (error: any) {
              if (error.response) {
                // Erro HTTP com resposta do servidor
                //console.error("❌ Erro da API (HTTP 400 ou 500):");
                //console.error("Status:", error.response.status);
                //console.error("Headers:", error.response.headers);
                //console.error("Body:", JSON.stringify(error.response.data, null, 2));
              } else if (error.request) {
                // Requisição enviada, mas sem resposta
                //console.error("⚠️ Requisição enviada, mas sem resposta da API:");
                //console.error(error.request);
              } else {
                // Erro de configuração, timeout, etc.
               // console.error("❌ Erro inesperado no cliente:");
               // console.error("Mensagem:", error.message);
               // console.error("Erro completo:", error);
              }
            }
           
          }
       
      }
     }
    };
 
    const fetchImovelRealm = () => {
     
      const imovelRealm = getImovel(idEntrevistado);
      console.log(imovelRealm)
      if(imovelRealm){
        setImovelPresente(imovelRealm);
      }


      //return imovelRealm;
    };
 
    const fetchImovelAPI = async () => {

      // evita chamada com id inválido
      if (!idEntrevistado || idEntrevistado <= 0) {
        console.log(`SYNC|IMOVEL|API_SKIP_INVALID_ID entrevistadoId=${idEntrevistado}`);
        return;
      }
    
      const isConnected = await testConnection();
      console.log(`SYNC|IMOVEL|API_CONNECTED=${isConnected}`);
    
      if (!isConnected) {
        console.log(`SYNC|IMOVEL|API_SKIP_OFFLINE entrevistadoId=${idEntrevistado}`);
        return;
      }
    
      try {
        const response = await connectionAPIGet<imovelBody>(
          `http://192.168.100.28:8080/imovel/imovel-entrevistado/${idEntrevistado}`
        );
    
        if (response && response.id) {
          const imovelData: imovelBody = {
            ...response,
            sincronizado: true,
            idLocal: '',
            idFather: '',
          };
    
          await salvarImoveis(imovelData);
          setImovelPresente(imovelData);
    
          console.log(`SYNC|IMOVEL|API_FETCH_DONE id=${imovelData.id}`);
        } else {
          throw new Error('Dados de imóvel inválidos');
        }
    
      } catch (error) {
        console.log('SYNC|IMOVEL|API_ERROR', error);
      }
    };
    
 
    useEffect(() => {
      if (!foccus) return;
      if (syncingRef.current) return;
      syncingRef.current = true;
    
      const sincronizarTudo = async () => {
        try {
          setLoadingImovel(true);
    
          await sinconizeImovelQueue(); // já faz post se tiver net
          await fetchImovelAPI();       // já checa id e net dentro
          fetchImovelRealm();           // sempre tenta atualizar do Realm
    
        } finally {
          setLoadingImovel(false);
          syncingRef.current = false;
        }
      };
    
      sincronizarTudo();
    }, [foccus, idEntrevistado]);
    
  
    return { imovelPresente, loadingImovel };
  };


 
   

