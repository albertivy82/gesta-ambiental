import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { setIdBenfeitoriaFromApiOnAguas } from "../../../realm/services/aguasService";
import { setIdBenfeitoriaFromApiOnAtvProd } from "../../../realm/services/atividadeProdutivaService";
import { apagarBenfeitiaQueue, getBenfeitoriaDessincronizadas, getBenfeitorias, salvarBenfeitorias } from "../../../realm/services/benfeitoriaService";
import { setIdBenfeitoriaFromApiCredito } from "../../../realm/services/creditoService";
import { setIdBenfeitoriaFromApiOnMorador } from "../../../realm/services/moradorService";
import { setIdBenfeitoriaFromApiOnRendasOF } from "../../../realm/services/rendaOutrasFontes";
import { setIdBenfeitoriaFromApiOnCS } from "../../../realm/services/servicosComunicacaoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";

export const convertToBenfeitoriaInput = (benfeitoria: any): BenfeitoriaInput => {
    const benfeitoriaInput: BenfeitoriaInput = {
      tipoBenfeitoria: benfeitoria.tipoBenfeitoria,
      funcao: benfeitoria.funcao,
      afastamentoDaPrincipal: benfeitoria.afastamentoDaPrincipal,
      impermeabilizacaoSolo: benfeitoria.impermeabilizacaoSolo,
      limites: benfeitoria.limites,
      areaBenfeitoria: benfeitoria.areaBenfeitoria,
      pavimentos: benfeitoria.pavimentos,
      paredes: benfeitoria.paredes,
      tipoCobertura: benfeitoria.tipoCobertura,
      tipoEsquadrias: benfeitoria.tipoEsquadrias,
      origemMadeiraDaConstrucao: benfeitoria.origemMadeiraDaConstrucao,
      origemPedraDaConstrucao: benfeitoria.origemPedraDaConstrucao,
      origemAreiaDaConstrucao: benfeitoria.origemAreiaDaConstrucao,
      alagamentos: benfeitoria.alagamentos,
      epocaOcorrencia: benfeitoria.epocaOcorrencia,
      efluentes: benfeitoria.efluentes,
      residuos: benfeitoria.residuos,
      fonteEnergia: benfeitoria.fonteEnergia,
      energiaAlimentos: benfeitoria.energiaAlimentos,
      meiosLocomocao: benfeitoria.meiosLocomocao,
      informativoPredominante: benfeitoria.informativoPredominante,
      imovel: {
        id: benfeitoria.imovel,
      },
    };
  
    return benfeitoriaInput;
  };
  


 export const useBenfeitorias = (imovelId:number, foccus:boolean)=>{

    const [benfeitoria, setBenfeitoria] = useState<BenfeitoriaType[]>([]);

   const sinconizeBenfeitoriaQueue = async () => {
   

    if(imovelId>0){
       
        const benfeitoriaQueue = getBenfeitoriaDessincronizadas(imovelId);
      
        if (benfeitoriaQueue.length > 0) {
            for (const benfeitoria of benfeitoriaQueue) {
               const novaBenfeitoriaInput = convertToBenfeitoriaInput(benfeitoria)
            
                const isConnected = await testConnection();
              
                    if (isConnected) {
                       // console.log("useBenfeitorias/isConnected", isConnected)
                        try {
                           // console.log("benfeitoria enviada",novaBenfeitoriaInput)
                            const response = await connectionAPIPost('http://177.74.56.24/benfeitoria', novaBenfeitoriaInput);
                           // console.log("benfeitpria. ponto de sisncronização 5")
                            const benfeitoriaAPI = response as BenfeitoriaType;
                           
                                if(benfeitoriaAPI.id){
                                    setIdBenfeitoriaFromApiOnMorador(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnAtvProd(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnCS(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnAguas(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnRendasOF(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiCredito(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    apagarBenfeitiaQueue(benfeitoria.idLocal!)
                                    //console.log("benfeitpria. ponto de sisncronização 6", )
                                }
                                
                        } catch (error) {
                            console.error('Erro na sincronização da benfeitoria:', error);
                        }
                    }
                
            }
        }

    }
    
    };
 

     const fetchBenfeitoriasRealm = () => {
            const benfeitoriaRealm = getBenfeitorias(imovelId);
            if (benfeitoriaRealm.length > 0) {
               setBenfeitoria((prevBenf) => [...prevBenf, ...benfeitoriaRealm]); // Aqui usamos benfeitoriaRealm
            }
        };

    const fetchBefeitoriasAPI = async() =>{

        try{
            const response = await connectionAPIGet<BenfeitoriaType[]>(`http://177.74.56.24/benfeitoria/imovel-benfeitoria/${imovelId}`);
                const bftData = response.map(bft=>({
                    ...bft,
                    sincronizado:true,
                    idLocal:'',
                    idFather:'',

                }))
              //  console.log("benfeitpria. circuito da API")    
                if(bftData && Array.isArray(bftData) && bftData.length>0){
                      await salvarBenfeitorias(bftData);
                       setBenfeitoria((prevBenf) => [...prevBenf, ...bftData]);
                }else{
                    throw new Error('Dados de benfeitoria Inválidos'); 
                }
        } catch (error) {
                //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
        }
    };

    useEffect(()=>{
        fetchBenfeitoriasRealm();
        fetchBefeitoriasAPI();
        sinconizeBenfeitoriaQueue();
    }, [foccus]);

    return {benfeitoria};
}