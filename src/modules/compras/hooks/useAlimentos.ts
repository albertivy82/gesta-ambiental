import { useState, useEffect } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { AlimentacaoType } from "../../../shared/types/AlimentacaoType";
import { getAlimentos, salvarAlimentos } from "../../../realm/services/alimentacaoService";


export const useBaseAlimentos = ()=>{
   const [alimentos, setAlimentos] = useState<boolean>();
        
      const fetchAlimentosRealm = async() =>{
              const alimentosDB = getAlimentos();
              if(alimentosDB){
                setAlimentos(true)
              }
      }
       
     const fetchAlimentosAPI = async()=>{
    
          try{
              const response = await connectionAPIGet(`http://192.168.100.28:8080/alimentacao`);
                  
                  const alimentosAPI = response as AlimentacaoType[];
                  
                  if(alimentosAPI && Array.isArray(alimentosAPI) && alimentosAPI.length>0){
                      setAlimentos(true);
                      salvarAlimentos(alimentosAPI)
                  }else{
                      throw new Error('Dados de alimentos inválidos'); 
                  }
                            
          }catch(error){
          console.error(error);
          }
    }
            
      
    useEffect(()=>{
        fetchAlimentosRealm();
        fetchAlimentosAPI()

    }, [])  
    
return {
      alimentos

}


}