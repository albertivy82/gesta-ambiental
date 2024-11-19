import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_DEPENDENCIA_INPUT: DependenciaInput = {
    dependencia: null,
    quantidade: 0,
    benfeitoria: {
      id: 0,
    },
  };
  
  export const useNovaDependencia = (id: number) => {
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
        benfeitoria: {
          id: id,
        },
        sincronizado: false,
        idLocal: uuidv4(),
      };
      return dependenciaData;
    };
  }  