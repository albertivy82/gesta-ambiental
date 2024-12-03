import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarAguaQueue } from "../../../realm/services/aguasService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { AguaInput } from "../../../shared/types/AguaIput";

export const DEFAULT_AGUA_INPUT: AguaInput = {
  possuiForneceimentoPublico: null,
  qualidadeFornecimentoPublico: null,
  corAguaForncimentoPublico: '',
  saborAguaFornecimentoPublico: '',
  cheiroAguaFornecimentoPublico: '',
  poco: null,
  profundidadePoco: 0,
  corAguaPoco: '',
  saborAguaPoco: '',
  cheiroAguaPoco: '',
  tratamentoAgua: null,
  benfeitoria: {
    id: 0,
  },
};

export const useNovaAgua = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novaAgua, setNovaAgua] = useState<AguaInput>(DEFAULT_AGUA_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaAgua);
    if (
      novaAgua.possuiForneceimentoPublico !== null &&
      novaAgua.qualidadeFornecimentoPublico !== null &&
      novaAgua.corAguaForncimentoPublico !== '' &&
      novaAgua.saborAguaFornecimentoPublico !== '' &&
      novaAgua.cheiroAguaFornecimentoPublico !== '' &&
      novaAgua.poco !== null &&
      novaAgua.profundidadePoco > 0 &&
      novaAgua.corAguaPoco !== '' &&
      novaAgua.saborAguaPoco !== '' &&
      novaAgua.cheiroAguaPoco !== '' &&
      novaAgua.tratamentoAgua !== null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaAgua]);

  const objetoFila = () => {
    const aguaData: AguaInput = {
      ...novaAgua,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de água
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      aguaData.benfeitoria = { id: benfeitoriaId };
      aguaData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        aguaData.idFather = idBenfeitoriaLocal;
        aguaData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return aguaData;
  };


  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const aguaDataQueue = objetoFila();
      salvarAguaQueue(aguaDataQueue);
      console.log("Água case: benfeitoria offline");
    } else {
      novaAgua.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/agua', novaAgua);
        } catch (error) {
          const aguaDataQueue = objetoFila();
          salvarAguaQueue(aguaDataQueue);
        }
      } else {
        const aguaDataQueue = objetoFila();
        salvarAguaQueue(aguaDataQueue);
      }
    }
  };
  
  

}  