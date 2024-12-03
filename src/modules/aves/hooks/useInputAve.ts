import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { AvesInput } from "../../../shared/types/AvesInput";
import { salvarAveQueue, salvarAves } from "../../../realm/services/avesService";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_AVES_INPUT: AvesInput = {
  especie: '',
  useCosumo: null,
  usoComercio: null,
  usoCriacao: null,
  usoRemedio: null,
  usoOutros: null,
  problemasRelacionados: '',
  ameacaSofrida: '',
  localDeAglomeracao: '',
  qualImpotanciaDaEespecie: '',
  alimentacao: '',
  desricaoEspontanea: '',
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAves = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean)  => {
  const [novaAve, setNovaAve] = useState<AvesInput>(DEFAULT_AVES_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaAve);
    if (
      novaAve.especie !== '' &&
      novaAve.useCosumo !== null &&
      novaAve.usoComercio !== null &&
      novaAve.usoCriacao !== null &&
      novaAve.usoRemedio !== null &&
      novaAve.usoOutros !== null &&
      novaAve.problemasRelacionados !== '' &&
      novaAve.ameacaSofrida !== '' &&
      novaAve.localDeAglomeracao !== '' &&
      novaAve.qualImpotanciaDaEespecie !== '' &&
      novaAve.alimentacao !== '' &&
      novaAve.desricaoEspontanea !== ''
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaAve]);

  const objetoFila = () => {
    const avesData: AvesInput = {
      ...novaAve,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de aves
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      avesData.benfeitoria = { id: benfeitoriaId };
      avesData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        avesData.idFather = idBenfeitoriaLocal;
        avesData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return avesData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const avesDataQueue = objetoFila();
      salvarAveQueue(avesDataQueue);
      console.log("Aves case: benfeitoria offline");
    } else {
      novaAve.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/aves', novaAve);
        } catch (error) {
          const avesDataQueue = objetoFila();
          salvarAveQueue(avesDataQueue);
        }
      } else {
        const avesDataQueue = objetoFila();
        salvarAveQueue(avesDataQueue);
      }
    }
  };
  
  


}  