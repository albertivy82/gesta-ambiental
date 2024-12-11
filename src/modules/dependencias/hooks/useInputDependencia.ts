import NetInfo from "@react-native-community/netinfo";
import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarDependenciaQueue } from "../../../realm/services/dependenciaService";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_DEPENDENCIA_INPUT: DependenciaInput = {
    dependencia: null,
    quantidade: 0,
    benfeitoria: {
      id: 0,
    },
  };
  
  export const useNovaDependencia = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
    const [novaDependencia, setNovaDependencia] = useState<DependenciaInput>(DEFAULT_DEPENDENCIA_INPUT);
    const [disabled, setDisabled] = useState<boolean>(false);
  
    useEffect(() => {
      console.log(novaDependencia);
      if (
        novaDependencia.dependencia !== null &&
        novaDependencia.quantidade > 0
      ) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }, [novaDependencia]);
  
    const objetoFila = () => {
      const dependenciaData: DependenciaInput = {
        ...novaDependencia,
        sincronizado: false,
        idLocal: uuidv4(), // Cria um ID único para o registro
      };
    
      if (benfeitoriaId > 0) {
        // Caso a benfeitoria tenha um ID oficial
        dependenciaData.benfeitoria = { id: benfeitoriaId };
        dependenciaData.idFather = "";
      } else {
        if (idBenfeitoriaLocal) {
          // Caso a benfeitoria esteja offline, usa o ID local
          dependenciaData.idFather = idBenfeitoriaLocal;
          dependenciaData.benfeitoria = { id: benfeitoriaId };
        } else {
          console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
        }
      }
    
      return dependenciaData;
    };

    const enviarRegistro = async () => {
      if (!sincronizado && benfeitoriaId <= 0) {
        // Benfeitoria offline
        const dependenciaDataQueue = objetoFila();
        salvarDependenciaQueue(dependenciaDataQueue);
        console.log("Dependência case: benfeitoria offline");
      } else {
        novaDependencia.benfeitoria = { id: benfeitoriaId };
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
    
        if (netInfoState.isConnected && isConnected) {
          try {
            await connectionAPIPost('http://192.168.100.28:8080/dependencia', novaDependencia);
          } catch (error) {
            const dependenciaDataQueue = objetoFila();
            salvarDependenciaQueue(dependenciaDataQueue);
          }
        } else {
          const dependenciaDataQueue = objetoFila();
          salvarDependenciaQueue(dependenciaDataQueue);
        }
      }
    };
    
    
  }  