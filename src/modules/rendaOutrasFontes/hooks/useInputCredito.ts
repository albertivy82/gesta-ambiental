import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { CreditoInput } from "../../../shared/types/CreditoInput";
import { salvarCreditoQueue } from "../../../realm/services/creditoService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";


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
export const useNovoCredito = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
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
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de crédito
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      creditoData.benfeitoria = { id: benfeitoriaId };
      creditoData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        creditoData.idFather = idBenfeitoriaLocal;
        creditoData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return creditoData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const creditoDataQueue = objetoFila();
      salvarCreditoQueue(creditoDataQueue);
      console.log("Crédito case: benfeitoria offline");
    } else {
      novoCredito.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/credito', novoCredito);
        } catch (error) {
          const creditoDataQueue = objetoFila();
          salvarCreditoQueue(creditoDataQueue);
        }
      } else {
        const creditoDataQueue = objetoFila();
        salvarCreditoQueue(creditoDataQueue);
      }
    }
  };
  
  
}