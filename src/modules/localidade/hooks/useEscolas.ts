import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { EscolaType } from "../../../shared/types/EscolaType";
import { getEscolas, salvarEscolas } from "../../../realm/services/escolaService";

export const useEscolas= (localidadeId:number)=>{
    const [escolas, setEscolas] = useState<boolean>(false)

    const fetchEscolasFromDb = ()=>{

        const escolasRealm = getEscolas(localidadeId);
        if(escolasRealm){
          
            setEscolas(true);
        }

    };

    const fetchEscolasFromApi = async ()=>{
        
        
        try{
            
            const escolasAPI = await connectionAPIGet(`http://192.168.100.28:8080/escola/localidade-escola/${localidadeId}`);
            const escData = escolasAPI as EscolaType[];
                if(escData && Array.isArray(escData) && escData.length>0){
                    salvarEscolas(escData);
                    setEscolas(true)
                }else{
                    throw new Error('Dados de Escolas Inválidos')
                }

        }catch (error){
            console.error('erro na busca de escolas', error)

        }

    };

    useEffect(()=>{
        fetchEscolasFromApi();
        fetchEscolasFromDb();
    }, []);

    return {escolas};

}