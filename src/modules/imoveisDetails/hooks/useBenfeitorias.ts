import { apagarBenfeitiaQueue, getBenfeitoriaDessincronizadas, getBenfeitorias, salvarBenfeitoria } from "../../../realm/services/benfeitoriaService"
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";

export const convertToBenfeitoriaInput=(benfeitoria: any) => {

console.log("imovel recuprado", benfeitoria.imovel.id)    
    const benfeitoriaInput: BenfeitoriaInput ={
        tipoBenfeitoria: benfeitoria.tipoBenfeitoria,
        funcao: benfeitoria.funcao,
        tipoSolo: benfeitoria.tipoSolo,
        areaBenfeitoria: benfeitoria.areaBenfeitoria,
        pavimentos: benfeitoria.pavimentos,
        tipoConstrucao: benfeitoria.tipoConstrucao,
        origemMaterialConstrucao: benfeitoria.origemMaterialConstrucao, 
        tipoCobertura: benfeitoria.tipoCobertura,
        tipoEsquadrias: benfeitoria.tipoEsquadrias,
        alagamentos: benfeitoria.alagamentos,
        nivelAlagamentos: benfeitoria.nivelAlagamentos,
        efluentes: benfeitoria.efluentes,
        residuos: benfeitoria.residuos,
        fonteEnergia: benfeitoria.fonteEnergia,
        energiaAlimentos: benfeitoria.energiaAlimentos,
        informativoPredominante: benfeitoria.informativoPredominante,
        importanciaDeProtegerFauna: benfeitoria.importanciaDeProtegerFauna,
        importanciaDeProtegerAmbiente: benfeitoria.importanciaDeProtegerAmbiente,
        qualEspacoPrecisaSerPreservado: benfeitoria.qualEspacoPrecisaSerPreservado,
        problemasRelacionadosAoAmbiente: benfeitoria.problemasRelacionadosAoAmbiente,
        imovel: {
            id: benfeitoria.imovel,
        },
    }
    console.log('benfeitoriaInput', benfeitoriaInput)
        return benfeitoriaInput
}

 export const useBenfeitorias = (imovelId:number)=>{

    const [contagemBenfeitoria, setcontagemBenfeitoria] = useState<number>(0);

   const sinconizeBenfeitoriaQueue = async () => {
    console.log("benfeitpria. ponto de sisncronização 2")
        const benfeitoriaQueue = getBenfeitoriaDessincronizadas(imovelId);
        console.log("benfeitpria. ponto de sisncronização 2.1", benfeitoriaQueue)
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
                                    //dar seu id para seus filhos
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
                    await salvarBenfeitoria(bftData);
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