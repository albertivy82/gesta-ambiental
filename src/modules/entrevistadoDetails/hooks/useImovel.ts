import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { setIdImovelFromApiOnBenfeitoria } from "../../../realm/services/benfeitoriaService";
import { apagarImovelQueue, getImoveisDessincronizados, getImovel, salvarImoveis } from "../../../realm/services/imovelService";
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
      equipamentosUrbanos: imovel.equipamntosUrbanos,
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
      const imovelQueue = getImoveisDessincronizados(idEntrevistado);
  
      if (imovelQueue) {
        const novoImovelInput = convertToImovelInput(imovelQueue);
       
       
          const isConnected = await testConnection();
          if (isConnected) {
            try {
              const response = await connectionAPIPost('http://177.74.56.24/imovel', novoImovelInput);
              const imovelAPI = response as imovelBody;
  
              if (imovelAPI.id) {
                setIdImovelFromApiOnBenfeitoria(imovelAPI.id, imovelQueue.idLocal!);
                apagarImovelQueue(imovelAPI.idLocal!);
                fetchImovelRealm();
              }
            } catch (error) {
              console.log('Há imóveis com problemas de sincronização com a API: '+ error);
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
      try {
        const response = await connectionAPIGet<imovelBody>(
          `http://177.74.56.24/imovel/imovel-entrevistado/${idEntrevistado}`
        );
  
        if (response as imovelBody && response.id) {
          const imovelData: imovelBody = {
            ...response,
            sincronizado: true,
            idLocal: '',
            idFather: '',
          };
  
          await salvarImoveis(imovelData);
          fetchImovelRealm();
        } else {
          throw new Error('Dados de imóvel inválidos');
        }
      } catch (error) {
        console.log('Não foi possível recuperar Imóveis da Apí: '+ error);
      }
    };
  
    useEffect(()=>{
      sinconizeImovelQueue();
      fetchImovelRealm();
      fetchImovelAPI();
  }, []);

  return {imovelPresente};
};
  