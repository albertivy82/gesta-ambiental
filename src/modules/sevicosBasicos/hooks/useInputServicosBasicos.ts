import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarServicosBasicosQueue } from "../../../realm/services/ServicosBasicosService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { ServicosBasicosInput } from "../../../shared/types/ServicosBasicosInput";


export const DEFAULT_SERVICOS_BASICOS_INPUT: ServicosBasicosInput = {
  tipoAtendimento: "",
  servicosDeficitarios: null,
  imovel: {
    id: 0,
  },
};

export const useNovoServicoBasico = (imovelId: number, idImovelLocal : string|undefined, sincronizado: boolean) => {
  const [novoServicoBasico, setNovoServicoBasico] = useState<ServicosBasicosInput>(DEFAULT_SERVICOS_BASICOS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoServicoBasico)
    if (
      novoServicoBasico.tipoAtendimento !== "" &&
      novoServicoBasico.servicosDeficitarios !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoServicoBasico]);

  const objetoFila = () => {
    //console.log("Iniciando criação do objeto fila...");
  
    const servBsicoData: ServicosBasicosInput = {
        ...novoServicoBasico, 
        sincronizado: false,  
        idLocal: uuidv4(), // Cria um ID único para a benfeitoria
    };
    // Verifica se o imóvel já possui um ID oficial (sincronizado)
    if (imovelId>0) {
       // console.log("ID do imóvel encontrado:", imovelId);
        // Se sim, usa o ID oficial
        servBsicoData.imovel!.id = imovelId;
        servBsicoData.idFather = "";
       // console.log("ID oficial do imóvel atribuído a benfeitoriaData:", benfeitoriaData.imovel);
    } else {
       // console.log("Imóvel não possui ID oficial ainda. Verificando idLocal...");
  
        if (idImovelLocal) {
          //  console.log("ID local do imóvel encontrado:", idImovelLocal);
            // Usa o idLocal do imóvel como referência
            servBsicoData.idFather = idImovelLocal;
            servBsicoData.imovel!.id = imovelId;
        } else {
            console.warn("ID local do imóvel não encontrado. Verifique se está sendo passado corretamente.");
        }
  
      
    }
  
    //console.log("Objeto benfeitoriaData final:", benfeitoriaData);
    return servBsicoData;
  };

  
  const enviarServicoBasico = async () => {
    if (!sincronizado && imovelId <= 0) {
      // Imóvel offline
      const servicoBasicoDataQueue = objetoFila();
      salvarServicosBasicosQueue(servicoBasicoDataQueue);
      console.log("Serviços Básicos case: imóvel offline");
    } else {
      novoServicoBasico.imovel = { id: imovelId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/servicos-basicos', novoServicoBasico);
        } catch (error) {
          const servicoBasicoDataQueue = objetoFila();
          salvarServicosBasicosQueue(servicoBasicoDataQueue);
        }
      } else {
        const servicoBasicoDataQueue = objetoFila();
        salvarServicosBasicosQueue(servicoBasicoDataQueue);
      }
    }
  };
  




    return {
         disabled,
    };
};
