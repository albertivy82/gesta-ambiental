import NetInfo from "@react-native-community/netinfo";
import { getEntrevistadosPendente, salvarEntrevistadoQueue, salvarEntrevistados } from "../../realm/services/entrevistado";
import { connectionAPIPost } from "../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../shared/types/EntrevistadoType";
import { EntrevistadoInput } from "../../shared/types/EntrevistadoInput";


export const convertToEntrevistadoInput = (entrevistado: EntrevistadoType): EntrevistadoInput => {
  const { id, ...rest } = entrevistado; // Remove o campo `id`
  return {
      ...rest,
      imovel: { id: entrevistado.imovel.id }, // Certifica-se de manter a estrutura do imovel
  };
};


export const gerenciarEntrevistado = async (entrevistadoId:string, imovelIdLocal:string|undefined, imovelIdApi: number|undefined) => {
            
      
      const entrevistadoPendente = getEntrevistadosPendente(entrevistadoId)
      console.log('@', entrevistadoPendente)
      entrevistadoPendente.imovel.id = imovelIdApi ?? 0;
      entrevistadoPendente.idFather = imovelIdLocal ?? "";
       console.log('@', entrevistadoPendente)
     
      if ( entrevistadoPendente.imovel.id>0) {
       
     
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
    
        if (netInfoState.isConnected && isConnected) {
              const entrevistadoEnvio =  convertToEntrevistadoInput(entrevistadoPendente); 
              
              try {
                
                await connectionAPIPost('http://192.168.100.28:8080/entrevistado', entrevistadoEnvio);
              } catch (error) {
                salvarEntrevistados(entrevistadoPendente);
              }
            } else {
              salvarEntrevistados(entrevistadoPendente);
          
        }
      }else{
        salvarEntrevistados(entrevistadoPendente);
      }
};
    
  
