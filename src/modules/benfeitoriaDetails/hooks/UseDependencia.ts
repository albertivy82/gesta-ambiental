import { useEffect, useState } from "react";
import { getDependencias, salvarDependencias } from "../../../realm/services/dependenciaService";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { DependenciaType } from "../../../shared/types/DependenciasType";


export const UseDependencia = (benfeitoria:number)=>{
    const [dependencia, setDependencia] = useState(false);

    const fetchRealm = async ()=>{
        const dependencias = getDependencias(benfeitoria);

        if(dependencias && Array.isArray(dependencias) && dependencias.length>0){
           setDependencia(true);
        }
    }

    const fetchAPI = async()=>{
        
        try {

            const response  = await connectionAPIGet(`http://192.168.100.28:8080/dependencias/por-benfeitoria/${benfeitoria}`);
            console.log("Hulk esmaga!", response)
            const depenciaAPI = response as DependenciaType[];
            
                if(depenciaAPI && Array.isArray(depenciaAPI) && depenciaAPI.length>0){
                    salvarDependencias(depenciaAPI);
                   
                    setDependencia(true);
                }else{
                    throw new Error('Dados de dependências inválidas'); 
                }
            
        } catch (error) {
            console.error(error);
        }{

        }
    }

    useEffect(()=>{
        fetchRealm();
        fetchAPI();
    }, []);

    return{
        dependencia
    } 
}