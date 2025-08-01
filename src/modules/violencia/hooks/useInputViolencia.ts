import NetInfo from "@react-native-community/netinfo";
import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { InstituicaoConhecidaInput } from "../../../shared/types/instituicaoConhecidaInput";
import { AtividadeProdutivaInput } from "../../../shared/types/AtividadeProdutivaInput";
import { ViolenciaInput } from "../../../shared/types/violenciaInput";
import { salvarViolenciaQueue } from "../../../realm/services/violenciaService";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_VIOLENCIA_INPUT: ViolenciaInput = {
  tipo: null,
  condicao: null,
  ocorrencias: 0,
  destaqueDoMorador: '',
  benfeitoria: {
    id: 0,
  },
  sincronizado: false,
  idLocal: undefined,
  idFather: undefined,
};

// Hook para manipular um novo registro de `Violencia`
export const useNovaViolencia = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean)  => {
  const [novaViolencia, setNovaViolencia] = useState<ViolenciaInput>(
    DEFAULT_VIOLENCIA_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaViolencia);
    if (
      novaViolencia.tipo !== null &&
      novaViolencia.condicao !== null &&
      novaViolencia.ocorrencias > 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaViolencia]);

  const objetoFila = () => {
    const violenciaData: ViolenciaInput = {
      ...novaViolencia,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de violência
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      violenciaData.benfeitoria = { id: benfeitoriaId };
      violenciaData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        violenciaData.idFather = idBenfeitoriaLocal;
        violenciaData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return violenciaData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const violenciaDataQueue = objetoFila();
      salvarViolenciaQueue(violenciaDataQueue);
      console.log("Violência case: benfeitoria offline");
    } else {
      novaViolencia.benfeitoria = { id: benfeitoriaId };
     
      const isConnected = await testConnection();
  
      if (isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/violencia', novaViolencia);
        } catch (error) {
          const violenciaDataQueue = objetoFila();
          salvarViolenciaQueue(violenciaDataQueue);
        }
      } else {
        const violenciaDataQueue = objetoFila();
        salvarViolenciaQueue(violenciaDataQueue);
      }
    }
  };
  
  

  }  