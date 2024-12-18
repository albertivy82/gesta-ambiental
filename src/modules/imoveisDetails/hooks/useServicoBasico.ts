import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarServicosBasicosQueue, getServicosBasicos, getServicosBasicosDessincronizados, salvarServicosBasicos } from "../../../realm/services/ServicosBasicosService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { ServicosBasicosInput } from "../../../shared/types/ServicosBasicosInput";
import { ServicosBasicosType } from "../../../shared/types/ServicosBasicosType";

export const convertToServicosBasicosInput=(servicos: any) => {

    const servicoInput: ServicosBasicosInput ={

        tipoAtendimento: servicos.tipoAtendimento,
        servicosDeficitarios: servicos.servicosDeficitarios,
        imovel: {
            id: servicos.imovel,
        },
      
    }
   
        return servicoInput
}


 export const useServicosBasicos = (imovelId:number)=>{

    const [contagemServicosBasicos, setcontagemServicosBasicos] = useState<number>(0);

   const sinconizeServicosBasicosQueue = async () => {
   

    if(imovelId>0){
        
        const servicosQueue = getServicosBasicosDessincronizados(imovelId);
      
        if (servicosQueue.length > 0) {
            for (const servicos of servicosQueue) {
               const novoServicosBasicosInput = convertToServicosBasicosInput(servicos)
               const netInfoState = await NetInfo.fetch();
                if (netInfoState.isConnected) {
                    const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('http://192.168.100.28:8080/Serviços-Básicos', novoServicosBasicosInput);
                             const servicosAPI = response as ServicosBasicosType;
                           
                                if(servicosAPI.id){
                                    apagarServicosBasicosQueue(servicosAPI.idLocal!)
                                }
                                
                        } catch (error) {
                            console.error('Erro na sincronização do servicos:', error);
                        }
                    }
                }
            }
        }

    }
    
    };
 

    const fetchServicosBasicosRealm = ()=>{

        const servicosRealm = getServicosBasicos(imovelId);

            if(servicosRealm.length>0){
                const servicossContagem = servicosRealm.length;
                setcontagemServicosBasicos(servicossContagem);
                              
            }
    }

    const fetchServicosBasicossAPI = async() =>{

        try{
            const response = await connectionAPIGet<ServicosBasicosType[]>(`http://192.168.100.28:8080/imovel-servicos-basicos/${imovelId}`);
                const servicosData = response.map(servicos=>({
                    ...servicos,
                    sincronizado:true,
                    idLocal:'',
                    idFather:'',

                }))
                //console.log("benfeitpria. circuito da API")    
                if(servicosData && Array.isArray(servicosData) && servicosData.length>0){
                    await salvarServicosBasicos(servicosData);
                    const constagem = servicosData.length;
                    setcontagemServicosBasicos(constagem);
                }else{
                    throw new Error('Dados de servicos Inválidos'); 
                }
        } catch (error) {
                console.error("CONTAGEM DE ENTREVISTADO!!!:", error);
        }
    };

    useEffect(()=>{
        fetchServicosBasicosRealm();
        fetchServicosBasicossAPI();
        sinconizeServicosBasicosQueue();
    }, []);

    return {contagemServicosBasicos};
}