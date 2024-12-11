import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { setIdBenfeitoriaFromApiOnAguas } from "../../../realm/services/aguasService";
import { setIdBenfeitoriaFromApiOnAlimentacao } from "../../../realm/services/alimentacaoService";
import { setIdBenfeitoriaFromApiOnAtvProd } from "../../../realm/services/atividadeProdutivaService";
import { setIdBenfeitoriaFromApiOnAves } from "../../../realm/services/avesService";
import { apagarBenfeitiaQueue, getBenfeitoriaDessincronizadas, getBenfeitorias, salvarBenfeitorias } from "../../../realm/services/benfeitoriaService";
import { setIdBenfeitoriaFromApiCompras } from "../../../realm/services/comprasService";
import { setIdBenfeitoriaFromApiCredito } from "../../../realm/services/creditoService";
import { setIdBenfeitoriaFromApiOnDependencias } from "../../../realm/services/dependenciaService";
import { setIdBenfeitoriaFromApiOnFauna } from "../../../realm/services/faunaService";
import { setIdBenfeitoriaFromApiOnIstConheci } from "../../../realm/services/instituicaoConhecidaService";
import { setIdBenfeitoriaFromApiOnMamiferos } from "../../../realm/services/mamiferosService";
import { setIdBenfeitoriaFromApiOnMorador } from "../../../realm/services/moradorService";
import { setIdBenfeitoriaFromApiOnPeixes } from "../../../realm/services/peixesService";
import { setIdBenfeitoriaFromApiOnPesca } from "../../../realm/services/pescaService";
import { setIdBenfeitoriaFromApiOnRendasOF } from "../../../realm/services/rendaOutrasFontes";
import { setIdBenfeitoriaFromApiOnCS } from "../../../realm/services/servicosComunicacaoService";
import { setIdBenfeitoriaFromApiOnVegetacao } from "../../../realm/services/vegetacaoService";
import { setIdBenfeitoriaFromApiOnViolencia } from "../../../realm/services/violenciaService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";

export const convertToEntrevistadoInput=(benfeitoria: any) => {

    const entrevistdoInput: EntrevistadoInput ={
        
    }
   
        return benfeitoriaInput
}


 export const useBenfeitorias = (imovelId:number)=>{

    const [contagemBenfeitoria, setcontagemBenfeitoria] = useState<number>(0);

   const sinconizeBenfeitoriaQueue = async () => {
   

    if(imovelId>0){
        console.log("useBenfeitorias/sinconizeBenfeitoriaQueue")
        const benfeitoriaQueue = getBenfeitoriaDessincronizadas(imovelId);
      
        if (benfeitoriaQueue.length > 0) {
            for (const benfeitoria of benfeitoriaQueue) {
               const novaBenfeitoriaInput = convertToBenfeitoriaInput(benfeitoria)
               console.log("benfeitpria. ponto de sisncronização 4")
                console.log("Como está esta benfeitoria?", novaBenfeitoriaInput);
                const netInfoState = await NetInfo.fetch();
                if (netInfoState.isConnected) {
                    const isConnected = await testConnection();
                    if (isConnected) {
                        try {
                            const response = await connectionAPIPost('http://192.168.100.28:8080/benfeitoria', novaBenfeitoriaInput);
                            console.log("benfeitpria. ponto de sisncronização 5")
                            const benfeitoriaAPI = response as BenfeitoriaType;
                           
                                if(benfeitoriaAPI.id){
                                    setIdBenfeitoriaFromApiOnAlimentacao(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiCompras(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnDependencias(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnAguas(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnAves(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiCredito(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnAtvProd(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnFauna(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnIstConheci(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnMamiferos(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnMorador(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnPeixes(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnPesca(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnRendasOF(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnCS(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnVegetacao(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    setIdBenfeitoriaFromApiOnViolencia(benfeitoriaAPI.id, benfeitoria.idLocal!);
                                    apagarBenfeitiaQueue(benfeitoria.idLocal!)
                                    console.log("benfeitpria. ponto de sisncronização 6", )
                                }
                                
                        } catch (error) {
                            console.error('Erro na sincronização do imóvel:', error);
                        }
                    }
                }
            }
        }

    }
    
    };
 

    const fetchBenfeitoriasRealm = ()=>{

        const benfeitoriasRealm = getBenfeitorias(imovelId);

            if(benfeitoriasRealm.length>0){
                const benfeitoriasContagem = benfeitoriasRealm.length;
                setcontagemBenfeitoria(benfeitoriasContagem);
                              
            }
    }

    const fetchBefeitoriasAPI = async() =>{

        try{
            const response = await connectionAPIGet<BenfeitoriaType[]>(`http://192.168.100.28:8080/benfeitoria/imovel-benfeitoria/${imovelId}`);
                const bftData = response.map(bft=>({
                    ...bft,
                    sincronizado:true,
                    idLocal:'',
                    idFather:'',

                }))
                console.log("benfeitpria. circuito da API")    
                if(bftData && Array.isArray(bftData) && bftData.length>0){
                    await salvarBenfeitorias(bftData);
                    const constagem = bftData.length;
                    setcontagemBenfeitoria(constagem);
                }else{
                    throw new Error('Dados de benfeitoria Inválidos'); 
                }
        } catch (error) {
                console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
        }
    };

    useEffect(()=>{
        fetchBenfeitoriasRealm();
        fetchBefeitoriasAPI();
        sinconizeBenfeitoriaQueue();
    }, []);

    return {contagemBenfeitoria};
}