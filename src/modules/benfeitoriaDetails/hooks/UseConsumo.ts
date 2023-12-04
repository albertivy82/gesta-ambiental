import { useEffect, useState } from "react";
import { getCompras, salvarCompras } from "../../../realm/services/comprasService";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { ComprasType } from "../../../shared/types/ComprasType";
import { getAlimentos, salvarAlimentos } from "../../../realm/services/alimentacaoService";
import { AlimentacaoType } from "../../../shared/types/AlimentacaoType";


export const UseConsumo = (benfeitoria: number)=>{

    const [alimentos, setAlimentos] = useState<boolean>();
    const [compras, setCompras] = useState<boolean>();

    const fetchcomprasRealm = async() =>{
        const comprasDB = getCompras(benfeitoria);
        if(comprasDB){
            setCompras(true)
        }
    }

    const fetchAlimentosRealm = async() =>{
      const alimentosDB = getAlimentos(benfeitoria);
      if(alimentosDB){
        setAlimentos(true)
      }
  }
   
    const fetchComprasAPI = async()=>{

        try{
          const response = await connectionAPIGet(`http://192.168.100.28:8080/compras/local-de-compras-benfeitoria/${benfeitoria}`);
            const comprasAPI = response as ComprasType;

            if(comprasAPI){
                setCompras(true);
                salvarCompras(comprasAPI)
            }else{
                throw new Error('Dados de compras inválidos'); 
            }
                
        }catch(error){
            console.error(error);
        }
    }

    const fetchAlimentosAPI = async()=>{

      try{
        const response = await connectionAPIGet(`http://192.168.100.28:8080/compras/local-de-compras-benfeitoria/${benfeitoria}`);
          const alimentosAPI = response as AlimentacaoType[];

          if(alimentosAPI && Array.isArray(alimentosAPI) && alimentosAPI.length>0){
              setCompras(true);
              salvarAlimentos(alimentosAPI)
          }else{
              throw new Error('Dados de alimentos inválidos'); 
          }
              
      }catch(error){
          console.error(error);
      }
  }
        
  
  
  
  
  
    useEffect(()=>{
    fetchcomprasRealm();
    fetchComprasAPI()
    fetchAlimentosRealm();
    fetchAlimentosAPI()
  }, [])  


  return {
    compras,
    alimentos
  }
}