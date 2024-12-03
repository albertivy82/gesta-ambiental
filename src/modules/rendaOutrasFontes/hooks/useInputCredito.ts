import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { CreditoInput } from "../../../shared/types/CreditoInput";


export const DEFAULT_CREDITO_INPUT: CreditoInput = {
  nome: '',
  valor: 0,
  benfeitoria: {
    id: 0,
  },
  sincronizado: false,
  idLocal: undefined,
  idFather: undefined,
};

// Hook para manipular um novo registro de `Credito`
export const useNovoCredito = (id: number) => {
  const [novoCredito, setNovoCredito] = useState<CreditoInput>(DEFAULT_CREDITO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novoCredito);
    if (novoCredito.nome !== '' && novoCredito.valor > 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novoCredito]);

  const objetoFila = () => {
    const creditoData: CreditoInput = {
      ...novoCredito,
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return creditoData;
  };
}