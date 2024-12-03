import { connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { ComprasInput } from "../../../shared/types/ComprasInput";


export const sendConsumo = async (selectedItems: number[], localDeCompras: string, detalheLocal: string, benfeitoria: number) =>{
  

    
    try{

       
            
        let detalheLocalFinal = localDeCompras === "Na Própria Localidade" ? undefined : detalheLocal;

        const comprasInput: ComprasInput = {
            ondeFazCompras: localDeCompras,
            detalheLocalDeCompras: detalheLocalFinal, 
            benfeitoria: {
                id: benfeitoria
            }
        };


    

       selectedItems.forEach(item=>{

        console.log(benfeitoria, item)
           connectionAPIPut(`http://192.168.100.28:8080/benfeitoria/${benfeitoria}/alimentos/${item}`);
        });

        await connectionAPIPost(`http://192.168.100.28:8080/compras`, comprasInput)
     
    }catch(error){
        throw new Error("");
        
    }


}