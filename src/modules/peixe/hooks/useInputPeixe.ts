import NetInfo from "@react-native-community/netinfo";
import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { salvarPeixeQueue } from "../../../realm/services/peixesService";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_PEIXES_INPUT: PeixesInput = {
  especie: '',
  locaisEspeciais: null,
  locaisEspecificosAlimentacao: null,
  usoAlimnetacao: null,
  usoComercio: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovoPeixe = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novoPeixe, setNovoPeixe] = useState<PeixesInput>(DEFAULT_PEIXES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoPeixe);
    if (
      novoPeixe.especie !== '' &&
      novoPeixe.locaisEspeciais !== null &&
      novoPeixe.locaisEspecificosAlimentacao !== null &&
      novoPeixe.usoAlimnetacao !== null &&
      novoPeixe.usoComercio !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoPeixe]);

  const objetoFila = () => {
    const peixeData: PeixesInput = {
      ...novoPeixe,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      peixeData.benfeitoria = { id: benfeitoriaId };
      peixeData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        peixeData.idFather = idBenfeitoriaLocal;
        peixeData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return peixeData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const peixeDataQueue = objetoFila();
      salvarPeixeQueue(peixeDataQueue);
      console.log("Peixe case: benfeitoria offline");
    } else {
      novoPeixe.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/peixe', novoPeixe);
        } catch (error) {
          const peixeDataQueue = objetoFila();
          salvarPeixeQueue(peixeDataQueue);
        }
      } else {
        const peixeDataQueue = objetoFila();
        salvarPeixeQueue(peixeDataQueue);
      }
    }
  };
  
  


}