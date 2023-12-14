import { useEffect, useState } from "react";
import { buscaAlimentosDaBenfeitoria, salvarAlimentos, salvarBenfeitoriaAlimentos } from "../../../realm/services/alimentacaoService";
import { getCompras, salvarCompras } from "../../../realm/services/comprasService";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { AlimentacaoType } from "../../../shared/types/AlimentacaoType";
import { ComprasType } from "../../../shared/types/ComprasType";


export const UseConsumo = (benfeitoria: number)=>{

    const [benfeitoriaAlimentos, setbenfeitoriaAlimentos] = useState<boolean>(false);
    const [compras, setCompras] = useState<boolean>(false);

    const fetchcomprasRealm = async() =>{
        const comprasDB = getCompras(benfeitoria);
        if(Array.isArray(comprasDB) && comprasDB.length > 0){
            setCompras(true)
        }
    }

    const fetchBenfeitoriaAlimentosRealm = async() =>{
      const alimentosDB = buscaAlimentosDaBenfeitoria(benfeitoria);
      console.log(alimentosDB)
      if(Array.isArray(alimentosDB) && alimentosDB.length > 0){
        setbenfeitoriaAlimentos(true)
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

  const fetchBenfeitoriaAlimentosAPI = async()=>{

      try{
        const response = await connectionAPIGet(`http://192.168.100.28:8080/alimentacao`);
          
        const alimentosAPI = response as AlimentacaoType[];
            if(alimentosAPI && Array.isArray(alimentosAPI) && alimentosAPI.length>0){
              salvarAlimentos(alimentosAPI)
              const AlimentosDaBenfeitoria = await connectionAPIGet(`http://192.168.100.28:8080/benfeitoria/${benfeitoria}/alimentos`);
                  if(AlimentosDaBenfeitoria && Array.isArray(AlimentosDaBenfeitoria) && AlimentosDaBenfeitoria.length>0){
                      salvarBenfeitoriaAlimentos( AlimentosDaBenfeitoria, benfeitoria)
                      setbenfeitoriaAlimentos(true)
                  }
               
            }else{
            console.log('ou aqui')
              throw new Error('Dados de alimentos inválidos'); 
            }
              
      }catch(error){
          console.error(error);
      }
  }
        
  
  
  
  
  
    useEffect(()=>{
    fetchcomprasRealm();
    fetchComprasAPI()
    fetchBenfeitoriaAlimentosRealm();
    fetchBenfeitoriaAlimentosAPI()
  }, [])  


  return {
    compras,
    benfeitoriaAlimentos
  }
}