import NetInfo from "@react-native-community/netinfo";
import { salvarEntrevistadoQueue } from "../../../realm/services/entrevistado";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { imovelBody } from "../../../shared/types/imovelType";




const enviarEntrevistado = async (entrevistadoId:String, imovel:imovelBody) => {
      buscar entrevistado no banco!!!!
      if (!imovel.sincronizado && imovel.id <= 0) {
        salvarEntrevistadoQueue(entrevistado);
        console.log("Entrevistado case: imóvel offline");
      } else {
        novoEntrevistado.imovel = { id: imovel.id };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
    
        if (netInfoState.isConnected && isConnected) {
          try {
            await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistado);
          } catch (error) {
            salvarEntrevistadoQueue(entrevistado);
          }
        } else {
          //const entrevistadoDataQueue = objetoFila();
          
        }
      }
    };
    

