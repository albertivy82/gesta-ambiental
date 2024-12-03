import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MoradorInput } from "../../../shared/types/MoradorInput";

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
export const useNovoMorador = (id: number) => {
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
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return moradorData;
  };

}