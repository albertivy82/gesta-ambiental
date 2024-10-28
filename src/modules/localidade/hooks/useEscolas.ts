import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarEscolaQueue, getEscolas, getEscolasDessincronizadas, salvarEscolas } from "../../../realm/services/escolaService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EscolaType } from "../../../shared/types/EscolaType";

export const convertToEscolaInput = (escola: any) => {
    const escolaInput = {
      nome: escola.nome,
      iniciativa: escola.iniciativa,
      merenda: escola.merenda,
      transporte: escola.transporte,
      educacaoAmbiental: escola.educacaoAmbiental,
      localidade: {
        id: escola.localidade,
      },
    };
  
    console.log('escolaInput', escolaInput);
    return escolaInput;
  };

export const useEscolas= (localidadeId:number)=>{
    const [contagemEscolas, setContagemescolas] = useState<number>(0);

    const sinconizeQueue = async () => {
        const escolasQueue = getEscolasDessincronizadas(localidadeId);
        if (escolasQueue.length > 0) {
            for (const escola of escolasQueue) {
                const novaEscolaIput = convertToEscolaInput(escola);
                //console.log(novaEscolaIput);
                const netInfoState = await NetInfo.fetch();
                if (netInfoState.isConnected) {
                    const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('http://192.168.100.28:8080/escola', novaEscolaIput);
                            const escolaAPI = response as EscolaType;
                           
                            if (escolaAPI.id) {
                               apagarEscolaQueue(escola.idLocal!);
                            }
                        } catch (error) {
                            console.error('Erro na sincronização do imóvel:', error);
                        }
                    }
                }
            }
        }
    };

    const fetchEscolasFromLocalDb = () =>{
        const localData = getEscolas(localidadeId);
              if (localData.length>0){
                const contagem = localData.length;
                setContagemescolas(contagem);
              }
    }


    const fetchEscolasromAPI = async () => {

        const netInfoState = await NetInfo.fetch();
        if (netInfoState.isConnected) {
            const isConnected = await testConnection();
            if (isConnected) {
          try {
              const escolasAPI = await connectionAPIGet<EscolaType[]>(`http://192.168.100.28:8080/escola/localidade-escola/${localidadeId}`);
             
              const EscData = escolasAPI.map(escola => ({
                  ...escola,
                  sincronizado: true, 
                  idLocal: '',         
              }));
             
              if(EscData && Array.isArray(EscData) && EscData.length> 0){
                   await salvarEscolas(EscData)
                   const contagem = EscData.length;
                   setContagemescolas(contagem);
              } else {
                    throw new Error('Dados de imóveis Inválidos');
              }
    
          } catch (error) {
            console.log("CONTAGEM DE IMOVEIS-ERRO!!!:", error);
          }
        }}
          
        };

        useEffect(()=>{
            sinconizeQueue()
            fetchEscolasromAPI();
            fetchEscolasFromLocalDb();
          }, []);
        
          return { contagemEscolas};

}   
    
   
