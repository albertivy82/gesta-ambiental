import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { RendaOutrasFontesInput } from "../../../shared/types/rendaOutrasFontesInput";


export const DEFAULT_RENDA_OUTRAS_FONTES_INPUT: RendaOutrasFontesInput = {
  fonte: null,
  beneficiarios: 0,
  rendaMesTotal: 0,
  benfeitoria: {
    id: 0,
  },
  sincronizado: false,
  idLocal: undefined,
  idFather: undefined,
};

// Hook para manipular um novo registro de `RendaOutrasFontes`
export const useNovaRendaOutrasFontes = (id: number) => {
  const [novaRendaOutrasFontes, setNovaRendaOutrasFontes] = useState<RendaOutrasFontesInput>(
    DEFAULT_RENDA_OUTRAS_FONTES_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaRendaOutrasFontes);
    if (
      novaRendaOutrasFontes.fonte !== null &&
      novaRendaOutrasFontes.beneficiarios > 0 &&
      novaRendaOutrasFontes.rendaMesTotal > 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaRendaOutrasFontes]);

  const objetoFila = () => {
    const rendaOutrasFontesData: RendaOutrasFontesInput = {
      ...novaRendaOutrasFontes,
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return rendaOutrasFontesData;
  };
}