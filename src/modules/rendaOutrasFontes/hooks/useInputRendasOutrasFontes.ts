import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarRendaOutrasFontesQueue } from "../../../realm/services/rendaOutrasFontes";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesInput } from "../../../shared/types/RendaOutrasFontesInput";


export const DEFAULT_RENDA_OUTRAS_FONTES_INPUT: RendaOutrasFontesInput = {
fonte: null,
beneficiarios: 0,
rendaMesTotal: 0, 
benfeitoria: {
    id: 0,
  },
};


export const useNovaRendaOutrasFontes = (benfeitoria: BenfeitoriaType) => {
  const [novaRendaOutrasFontes, setNovaRendaOutrasFontes] = useState<RendaOutrasFontesInput>(DEFAULT_RENDA_OUTRAS_FONTES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaRendaOutrasFontes);
    if (
      novaRendaOutrasFontes.fonte !== null &&
      novaRendaOutrasFontes.beneficiarios ==0 &&
      novaRendaOutrasFontes.rendaMesTotal ==0 

    ) {
      setDisabled(false);
    }
  }, [novaRendaOutrasFontes]);

  const objetoFila = () => {
    const rendaOutrasFontesData: RendaOutrasFontesInput = {
      ...novaRendaOutrasFontes,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      rendaOutrasFontesData.benfeitoria!.id = benfeitoria.id;
      rendaOutrasFontesData.idFather = "";
    } else if (benfeitoria.idLocal) {
      rendaOutrasFontesData.idFather = benfeitoria.idLocal;
      rendaOutrasFontesData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return rendaOutrasFontesData;
  };

  const inputRendaOutrasFontesApi = async () => {
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
      const rendaOutrasFontesDataQueue = objetoFila();
      console.log("useInputRendaOutrasFontes_a", novaRendaOutrasFontes);
      salvarRendaOutrasFontesQueue(rendaOutrasFontesDataQueue);
    } else {
      novaRendaOutrasFontes.benfeitoria = { id: benfeitoria.id };
      console.log(novaRendaOutrasFontes.benfeitoria.id, "se não estiver correto, devo obedecer o modo de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputRendaOutrasFontes_b", novaRendaOutrasFontes);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputRendaOutrasFontes_c", novaRendaOutrasFontes);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/renda-outras-fontes', novaRendaOutrasFontes);
          console.log("useInputRendaOutrasFontes_d", novaRendaOutrasFontes);
        } catch (error) {
          const rendaOutrasFontesDataQueue = objetoFila();
          salvarRendaOutrasFontesQueue(rendaOutrasFontesDataQueue);
          console.log("useInputRendaOutrasFontes_e", novaRendaOutrasFontes);
        }
      } else {
        const rendaOutrasFontesDataQueue = objetoFila();
        salvarRendaOutrasFontesQueue(rendaOutrasFontesDataQueue);
        console.log("useInputRendaOutrasFontes_f", novaRendaOutrasFontes);
      }
    }
  };

  return {
    novaRendaOutrasFontes,
    inputRendaOutrasFontesApi,
    disabled,
  };
};