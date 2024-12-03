import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { Vizinhos } from "../../../enums/Vizinhos";
import { documentacao } from "../../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../../enums/tipoSolo.enum";
import { transporteEnum } from "../../../enums/transporte.enum";
import { salvarImovelQueue } from "../../../realm/services/imovelService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { formatDateForApi } from "../../../shared/functions/data";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { salvarEntrevistadoQueue } from "../../../realm/services/entrevistado";

export const DEFAUL_ENTREVISTADO_INPUT: EntrevistadoInput = {
  nome: ' ',
  apelido: '',
  naturalidade: '',
  conheceUcProposta: null,
  propostaMelhorarArea: '',
  imovel: {
    id:0,
  },
};


export const useNovoEntrevistado = (imovelId: number, idImovelLocal : string|undefined, sincronizado: boolean) => {
    const [novoEntrevistado, setnovoEntrevistado] = useState<EntrevistadoInput>(DEFAUL_ENTREVISTADO_INPUT);
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        console.log(novoEntrevistado)
       if(
        novoEntrevistado.nome !== '' && 
        novoEntrevistado.apelido !== '' && 
        novoEntrevistado.naturalidade !== '' && 
        novoEntrevistado.conheceUcProposta != null &&
        novoEntrevistado.propostaMelhorarArea !== '' 
        )
        {
          setDisabled(true)
        } 
       
    }, [novoEntrevistado]);

    
    const objetoFila = () => {
      //console.log("Iniciando criação do objeto fila...");
    
      const entrevistadoData: EntrevistadoInput = {
        
          ...novoEntrevistado, 
          sincronizado: false,  
          idLocal: uuidv4(), // Cria um ID único para a benfeitoria
      };
      // Verifica se o imóvel já possui um ID oficial (sincronizado)
      if (imovelId>0) {
         // console.log("ID do imóvel encontrado:", imovelId);
          // Se sim, usa o ID oficial
          entrevistadoData.imovel!.id = imovelId;
          entrevistadoData.idFather = "";
         // console.log("ID oficial do imóvel atribuído a benfeitoriaData:", benfeitoriaData.imovel);
      } else {
         // console.log("Imóvel não possui ID oficial ainda. Verificando idLocal...");
    
          if (idImovelLocal) {
            //  console.log("ID local do imóvel encontrado:", idImovelLocal);
              // Usa o idLocal do imóvel como referência
              entrevistadoData.idFather = idImovelLocal;
              entrevistadoData.imovel!.id = imovelId;
          } else {
              console.warn("ID local do imóvel não encontrado. Verifique se está sendo passado corretamente.");
          }
    
        
      }
    
      //console.log("Objeto benfeitoriaData final:", benfeitoriaData);
      return entrevistadoData;
    };

    const enviarEntrevistado = async () => {
      if (!sincronizado && imovelId <= 0) {
        // Imóvel offline
        const entrevistadoDataQueue = objetoFila();
        salvarEntrevistadoQueue(entrevistadoDataQueue);
        console.log("Entrevistado case: imóvel offline");
      } else {
        novoEntrevistado.imovel = { id: imovelId };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
    
        if (netInfoState.isConnected && isConnected) {
          try {
            await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistado);
          } catch (error) {
            const entrevistadoDataQueue = objetoFila();
            salvarEntrevistadoQueue(entrevistadoDataQueue);
          }
        } else {
          const entrevistadoDataQueue = objetoFila();
          salvarEntrevistadoQueue(entrevistadoDataQueue);
        }
      }
    };
    



    

      
    

    return {
        
        disabled,
    };
};
