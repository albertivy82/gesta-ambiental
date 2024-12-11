import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MamiferosInput } from "../../../shared/types/MamiferosInput";
import { salvarMamiferoQueue } from "../../../realm/services/mamiferosService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";

export const DEFAULT_MAMIFEROS_INPUT: MamiferosInput = {
  
  especie: '',
  usoConsumo: null,
  usoComercio: null,
  usoCriacao: null,
  usoRemedio: null,
  usoOutros: null,
  problemasRelacionados: '',
  alimentacao: '',
  desricaoEspontanea: '',
  benfeitoria: {
    id: 0,
  },
};

export const useNovoMamifero = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novoMamifero, setNovoMamifero] = useState<MamiferosInput>(DEFAULT_MAMIFEROS_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoMamifero);
    if (
      novoMamifero.especie !== '' &&
      novoMamifero.usoConsumo !== null &&
      novoMamifero.usoComercio !== null &&
      novoMamifero.usoCriacao !== null &&
      novoMamifero.usoRemedio !== null &&
      novoMamifero.usoOutros !== null &&
      novoMamifero.problemasRelacionados !== '' &&
      novoMamifero.alimentacao !== '' &&
      novoMamifero.desricaoEspontanea !== ''
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoMamifero]);

  const objetoFila = () => {
    const mamiferoData: MamiferosInput = {
      ...novoMamifero,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de mamíferos
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      mamiferoData.benfeitoria = { id: benfeitoriaId };
      mamiferoData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        mamiferoData.idFather = idBenfeitoriaLocal;
        mamiferoData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return mamiferoData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const mamiferoDataQueue = objetoFila();
      salvarMamiferoQueue(mamiferoDataQueue);
      console.log("Mamíferos case: benfeitoria offline");
    } else {
      novoMamifero.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/mamifero', novoMamifero);
        } catch (error) {
          const mamiferoDataQueue = objetoFila();
          salvarMamiferoQueue(mamiferoDataQueue);
        }
      } else {
        const mamiferoDataQueue = objetoFila();
        salvarMamiferoQueue(mamiferoDataQueue);
      }
    }
  };
  
  


}