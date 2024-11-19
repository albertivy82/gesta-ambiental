import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { PeixesInput } from "../../../shared/types/PeixesInput";

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

export const useNovoPeixe = (id: number) => {
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
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return peixeData;
  };


}