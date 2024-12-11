import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { RendaOutrasFontesInput } from "../../../shared/types/rendaOutrasFontesInput";
import { salvarRendaOutrasFontesQueue } from "../../../realm/services/rendaOutrasFontes";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";


export const DEFAULT_RENDA_OUTRAS_FONTES_INPUT: RendaOutrasFontesInput = {
  fonte: null,
  beneficiarios: 0,
  rendaMesTotal: 0,
  benfeitoria: {
    id: 0,
  },
  sincronizado: false,
  idLocal: undefined,
  idFather: undefined,
};

// Hook para manipular um novo registro de `RendaOutrasFontes`
export const useNovaRendaOutrasFontes = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean)  => {
  const [novaRendaOutrasFontes, setNovaRendaOutrasFontes] = useState<RendaOutrasFontesInput>(
    DEFAULT_RENDA_OUTRAS_FONTES_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaRendaOutrasFontes);
    if (
      novaRendaOutrasFontes.fonte !== null &&
      novaRendaOutrasFontes.beneficiarios > 0 &&
      novaRendaOutrasFontes.rendaMesTotal > 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaRendaOutrasFontes]);

  const objetoFila = () => {
    const rendaOutrasFontesData: RendaOutrasFontesInput = {
      ...novaRendaOutrasFontes,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      rendaOutrasFontesData.benfeitoria = { id: benfeitoriaId };
      rendaOutrasFontesData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        rendaOutrasFontesData.idFather = idBenfeitoriaLocal;
        rendaOutrasFontesData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return rendaOutrasFontesData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const rendaOutrasFontesDataQueue = objetoFila();
      salvarRendaOutrasFontesQueue(rendaOutrasFontesDataQueue);
      console.log("Renda Outras Fontes case: benfeitoria offline");
    } else {
      novaRendaOutrasFontes.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/renda-outras-fontes', novaRendaOutrasFontes);
        } catch (error) {
          const rendaOutrasFontesDataQueue = objetoFila();
          salvarRendaOutrasFontesQueue(rendaOutrasFontesDataQueue);
        }
      } else {
        const rendaOutrasFontesDataQueue = objetoFila();
        salvarRendaOutrasFontesQueue(rendaOutrasFontesDataQueue);
      }
    }
  };
  
  
}