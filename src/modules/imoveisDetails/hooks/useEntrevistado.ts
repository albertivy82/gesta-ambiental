import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { apagarEntrevistadoQueue, getEntrevistados, getEntrevistadosDessincronizados, salvarEntrevistados } from "../../../realm/services/entrevistado";
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


 export const useEntrevistado = (imovelId:number)=>{

   const sinconizeEntrevistadoQueue = async () => {
   

           
        const entrevistadoQueue = getEntrevistadosDessincronizados(imovelId);
      
        if (!entrevistadoQueue) {
           const novoEntrevistadoInput = convertToEntrevistadoInput(entrevistadoQueue)
               const netInfoState = await NetInfo.fetch();
                if (netInfoState.isConnected) {
                    const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistadoInput);
                             const entrevistadoAPI = response as EntrevistadoType;
                           
                                if(entrevistadoAPI.id){
                                    apagarEntrevistadoQueue(entrevistadoAPI.idLocal!)
                                }
                                
                        } catch (error) {
                            console.error('Erro na sincronização do entrevistado:', error);
                        }
                    }
                }
            
        }

    
    
    };
 

    const fetchEntrevistadoRealm = ()=>{

        const entrevistadoRealm = getEntrevistados(imovelId);
    }

    const fetchEntrevistadosAPI = async() =>{

        try{
            const response = await connectionAPIGet<EntrevistadoType[]>(`http://192.168.100.28:8080/entrevistado/imovel-entrevistado/${imovelId}`);
                const entrevistadoData = response.map(entrevistado=>({
                    ...entrevistado,
                    sincronizado:true,
                    idLocal:'',
                    idFather:'',

                }))
                //console.log("benfeitpria. circuito da API")    
                if(!entrevistadoData ){
                    await salvarEntrevistados(entrevistadoData);
                }else{
                    throw new Error('Dados de entrevistado Inválidos'); 
                }
        } catch (error) {
                console.error("CONTAGEM DE ENTREVISTADO!!!:", error);
        }
    };

    useEffect(()=>{
        fetchEntrevistadoRealm();
        fetchEntrevistadosAPI();
        sinconizeEntrevistadoQueue();
    }, []);

    
}