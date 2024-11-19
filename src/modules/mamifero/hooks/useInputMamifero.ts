import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { MamiferosType } from "../../../shared/types/MamiferosType";
import { MamiferosInput } from "../../../shared/types/MamiferosInput";

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

export const useNovoMamifero = (id: number) => {
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
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return mamiferoData;
  };


}