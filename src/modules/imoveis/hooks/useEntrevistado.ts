import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { apagarEntrevistadoQueue, getEntrevistado, getEntrevistadosDessincronizados, salvarEntrevistados } from "../../../realm/services/entrevistado";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";

export const convertToEntrevistadoInput=(entrevistado: any) => {

    const entrevistdoInput: EntrevistadoInput ={

        nome: entrevistado.nome,
        apelido: entrevistado.apelido,
        naturalidade: entrevistado.naturalidade,
        conheceUcProposta: entrevistado.conheceUcProposta,
        propostaMelhorarArea: entrevistado.propostaMelhorarArea,
        imovel: {
            id: entrevistado.imovel,
        },
      
    }
   
        return entrevistdoInput
}


 export const useEntrevistado = (idsImoveis:number[])=>{

   const sinconizeEntrevistadoQueue = async (imovelId:number) => {
   
   
       const entrevistadoQueue = getEntrevistadosDessincronizados(imovelId);
      
        if (entrevistadoQueue) {
         
           const novoEntrevistadoInput = convertToEntrevistadoInput(entrevistadoQueue)
               const netInfoState = await NetInfo.fetch();
                if (netInfoState.isConnected) {
                    const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                         
                            const response = await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistadoInput);
                             const entrevistadoAPI = response as EntrevistadoType;
                           
                                if(entrevistadoAPI.id){
                                   //console.log("Imóvel sincronizado. ID recebido:", EntrevistadoAPI.id);
                                                              // Atualizar as benfeitorias com o novo ID
                                                              setIdEntrevistadoFromApiOnBenfeitoria(EntrevistadoAPI.id, Entrevistado.idLocal!);
                                                              setIdEntrevistadoFromApiOnEntrevistado(EntrevistadoAPI.id, Entrevistado.idLocal!);
                                                              setIdEntrevistadoFromApiServsBsics(EntrevistadoAPI.id, Entrevistado.idLocal!);
                                                              setIdEntrevistadoFromApiOtherServs(EntrevistadoAPI.id, Entrevistado.idLocal!);
                                                              
                                                              //console.log("ID local do imóvel:", Entrevistado.idLocal!);
                                                              // Remover imóvel da fila
                                    apagarEntrevistadoQueue(entrevistadoAPI.idLocal!)
                                }
                                
                        } catch (error) {
                            console.error('Erro na sincronização do entrevistado:', error);
                        }
                    }
                }
            
        }

    
    
    };
 

    const fetchEntrevistadoRealm = (idImovel:number)=>{
        //pra que este método?
        const entrevistadoRealm = getEntrevistado(idImovel);
    }

    const fetchEntrevistadoAPI = async (idImovel: number) => {
        try {
          const response = await connectionAPIGet<EntrevistadoType>(
            `http://192.168.100.28:8080/entrevistado/imovel-entrevistado/${idImovel}`);
      
          if (response as EntrevistadoType && response.id) {
            const entrevistadoData: EntrevistadoType  = {
              ...response,
              sincronizado: true,
              idLocal: '',
              idFather: '',
            };
      
            
            
            await salvarEntrevistados(entrevistadoData);
          } else {
            throw new Error("Dados de entrevistado inválidos");
          }
        } catch (error) {
          console.error("Erro ao buscar entrevistado:", error);
        }
      };
      
    

    useEffect(() => {
        idsImoveis.forEach(async (idImovel) => {
          // Sincronize ou obtenha os entrevistados para cada ID de imóvel
          await fetchEntrevistadoRealm(idImovel);
          await fetchEntrevistadoAPI(idImovel);
          await sinconizeEntrevistadoQueue(idImovel);
        
        });
      }, [idsImoveis]);


    
    
}