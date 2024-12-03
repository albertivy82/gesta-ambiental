import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { salvarOutrosServicosQueue } from "../../../realm/services/outrosServicosService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { OutrosServicosInput } from "../../../shared/types/OutrosServicosInput";
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_OUTROS_SERVICOS_INPUT: OutrosServicosInput = {
  outrosServicos: null,
  imovel: {
    id: 0,
  },
};

export const useNovoOutroServico = (imovelId: number, idImovelLocal : string|undefined, sincronizado: boolean) => {
  const [novoOutroServico, setNovoOutroServico] = useState<OutrosServicosInput>(DEFAULT_OUTROS_SERVICOS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoOutroServico)
    if (
      novoOutroServico.outrosServicos !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoOutroServico]);

  const objetoFila = () => {
    //console.log("Iniciando criação do objeto fila...");
  
    const outrosServicosData: OutrosServicosInput = {
        ...novoOutroServico, 
        sincronizado: false,  
        idLocal: uuidv4(), // Cria um ID único para a benfeitoria
    };
    // Verifica se o imóvel já possui um ID oficial (sincronizado)
    if (imovelId>0) {
       // console.log("ID do imóvel encontrado:", imovelId);
        // Se sim, usa o ID oficial
        outrosServicosData.imovel!.id = imovelId;
        outrosServicosData.idFather = "";
       // console.log("ID oficial do imóvel atribuído a benfeitoriaData:", benfeitoriaData.imovel);
    } else {
       // console.log("Imóvel não possui ID oficial ainda. Verificando idLocal...");
  
        if (idImovelLocal) {
          //  console.log("ID local do imóvel encontrado:", idImovelLocal);
            // Usa o idLocal do imóvel como referência
            outrosServicosData.idFather = idImovelLocal;
            outrosServicosData.imovel!.id = imovelId;
        } else {
            console.warn("ID local do imóvel não encontrado. Verifique se está sendo passado corretamente.");
        }
  
      
    }
  
    //console.log("Objeto benfeitoriaData final:", benfeitoriaData);
    return outrosServicosData;
  };
  
  
  
  
  const enviarOutroServico = async () => {
    if (!sincronizado && imovelId <= 0) {
      // Imóvel offline
      const outroServicoDataQueue = objetoFila();
      salvarOutrosServicosQueue(outroServicoDataQueue);
      console.log("Outros Serviços case: imóvel offline");
    } else {
      novoOutroServico.imovel = { id: imovelId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/outros-servicos', novoOutroServico);
        } catch (error) {
          const outroServicoDataQueue = objetoFila();
          salvarOutrosServicosQueue(outroServicoDataQueue);
        }
      } else {
        const outroServicoDataQueue = objetoFila();
        salvarOutrosServicosQueue(outroServicoDataQueue);
      }
    }
  };
  



 
    return {
       
        disabled,
    };
};
