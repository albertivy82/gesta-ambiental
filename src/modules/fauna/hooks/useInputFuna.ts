import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { MamiferosType } from "../../../shared/types/MamiferosType";
import { MamiferosInput } from "../../../shared/types/MamiferosInput";
import { FaunaInput } from "../../../shared/types/FaunaInput";

export const DEFAULT_FAUNA_INPUT: FaunaInput = {
  especie: '',
  ocorreMata: null,
  ocorreRio: null,
  ocorreLago: null,
  ocorreRua: null,
  ocorreQuintal: null,
  outrasOcorrencias: null,
  frequenciaAtual: '',
  frequenciaPassada: null,
  tempoQueNaoVe: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaFauna = (id: number) => {
  const [novaFauna, setNovaFauna] = useState<FaunaInput>(DEFAULT_FAUNA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaFauna);
    if (
      novaFauna.especie !== '' &&
      novaFauna.ocorreMata !== null &&
      novaFauna.ocorreRio !== null &&
      novaFauna.ocorreLago !== null &&
      novaFauna.ocorreRua !== null &&
      novaFauna.ocorreQuintal !== null &&
      novaFauna.outrasOcorrencias !== null &&
      novaFauna.frequenciaAtual !== '' &&
      novaFauna.frequenciaPassada !== null &&
      novaFauna.tempoQueNaoVe !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaFauna]);

  const objetoFila = () => {
    const faunaData: FaunaInput = {
      ...novaFauna,
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return faunaData;
  };

}