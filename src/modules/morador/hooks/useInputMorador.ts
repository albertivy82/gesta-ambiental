import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MoradorInput } from "../../../shared/types/MoradorInput";
import { salvarMoradorQueue } from "../../../realm/services/moradorService";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";

export const DEFAULT_MORADOR_INPUT: MoradorInput = {
  dataNascimento: '',
  idade: 0,
  perfil: null,
  sexo: null,
  estadoCivil: null,
  escolaridade: null,
  ondeEstuda: '',
  trabalho: null,
  religiao: '',
  benfeitoria: {
    id: 0,
  },
};

// Hook para manipular um novo registro de `Morador`
export const useNovoMorador = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novoMorador, setNovoMorador] = useState<MoradorInput>(DEFAULT_MORADOR_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoMorador);
    if (
      novoMorador.dataNascimento !== '' &&
      novoMorador.idade > 0 &&
      novoMorador.perfil !== '' &&
      novoMorador.sexo !== '' &&
      novoMorador.estadoCivil !== null &&
      novoMorador.escolaridade !== null &&
      novoMorador.trabalho != null &&
      novoMorador.religiao !== ''
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoMorador]);

  const objetoFila = () => {
    const moradorData: MoradorInput = {
      ...novoMorador,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      moradorData.benfeitoria = { id: benfeitoriaId };
      moradorData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        moradorData.idFather = idBenfeitoriaLocal;
        moradorData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return moradorData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const moradorDataQueue = objetoFila();
      salvarMoradorQueue(moradorDataQueue);
      console.log("Morador case: benfeitoria offline");
    } else {
      novoMorador.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/morador', novoMorador);
        } catch (error) {
          const moradorDataQueue = objetoFila();
          salvarMoradorQueue(moradorDataQueue);
        }
      } else {
        const moradorDataQueue = objetoFila();
        salvarMoradorQueue(moradorDataQueue);
      }
    }
  };
  
  

}