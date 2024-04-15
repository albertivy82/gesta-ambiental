import { getBenfeitorias, salvarBenfeitoria } from "../../../realm/services/benfeitoriaService"
import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";

export const useBenfeitorias = (imovelId:number)=>{

    const [contagemBenfeitoria, setcontagemBenfeitoria] = useState<number>(0);
 

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
    }, []);

    return {contagemBenfeitoria};
}