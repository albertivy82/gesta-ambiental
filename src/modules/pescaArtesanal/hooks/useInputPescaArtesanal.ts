import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { salvarPescaArtesanalQueue } from "../../../realm/services/pescaService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { PescaArtesanalInput } from "../../../shared/types/PescaArtesanalInput";

export const DEFAULT_PESCA_ARTESANAL_INPUT: PescaArtesanalInput = {
  freqPescaSemanal: 0,
  horasPorDia: 0,
  localDaPesca: '',
  horarioPrefencialPesca: '',
  descartePorPescaria: 0,
  conservacaoPeixe: '',
  custeio: '',
  geloPorPescaria: 0,
  custoGeloPorPescaria: 0,
  composicaoRancho: '',
  custoRanchoPorViagem: 0,
  combustivelPorViagem: 0,
  custoCombustivelPorViagem: 0,
  localDesembarque: '',
  pescaPorSafra: 0,
  localPescaSafra: '',
  localDeReproducaoPeixe: '',
  periodoDefeso: '',
  conheceDefeso: null,
  concordaDefeso: null,
  recebeDefeso: null,
  benfeitoria: {
    id: 0,
  },
};

export const useInputPescaArtesanal = (benfeitoria: BenfeitoriaType) => {
  const [novaPescaArtesanal, setNovaPescaArtesanal] = useState<PescaArtesanalInput>(DEFAULT_PESCA_ARTESANAL_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaPescaArtesanal);
    if (
      novaPescaArtesanal.freqPescaSemanal > 0 &&
      novaPescaArtesanal.horasPorDia > 0 &&
      novaPescaArtesanal.localDaPesca !== '' &&
      novaPescaArtesanal.horarioPrefencialPesca !== '' &&
      novaPescaArtesanal.descartePorPescaria >= 0 &&
      novaPescaArtesanal.conservacaoPeixe !=='' &&
      novaPescaArtesanal.custeio !== '' &&
      novaPescaArtesanal.geloPorPescaria > 0 &&
      novaPescaArtesanal.custoGeloPorPescaria >= 0 &&
      novaPescaArtesanal.composicaoRancho !== '' &&
      novaPescaArtesanal.custoRanchoPorViagem >= 0 &&
      novaPescaArtesanal.combustivelPorViagem > 0 &&
      novaPescaArtesanal.custoCombustivelPorViagem >= 0 &&
      novaPescaArtesanal.localDesembarque !== '' &&
      novaPescaArtesanal.pescaPorSafra >= 0 &&
      novaPescaArtesanal.localPescaSafra !== '' &&
      novaPescaArtesanal.localDeReproducaoPeixe !== '' &&
      novaPescaArtesanal.periodoDefeso !== '' &&
      novaPescaArtesanal.conheceDefeso != null &&
      novaPescaArtesanal.concordaDefeso != null &&
      novaPescaArtesanal.recebeDefeso != null
    ) {
      setDisabled(true);
    } 
  }, [novaPescaArtesanal]);



  const objetoFila = () => {
    const pescaArtesanalData: PescaArtesanalInput = {
      ...novaPescaArtesanal,
      sincronizado: false,
      idLocal: uuidv4(),
    };

    if (benfeitoria.id > 0) {
      pescaArtesanalData.benfeitoria!.id = benfeitoria.id;
      pescaArtesanalData.idFather = "";
    } else if (benfeitoria.idLocal) {
      pescaArtesanalData.idFather = benfeitoria.idLocal;
      pescaArtesanalData.benfeitoria!.id = benfeitoria.id;
    } else {
      console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
    }

    return pescaArtesanalData;
  };

  const inputPescaArtesanalApi = async () => {
    if (!benfeitoria.sincronizado && benfeitoria.id <= 0) {
      const pescaArtesanalDataQueue = objetoFila();
      console.log("useInputPescaArtesanal_a", novaPescaArtesanal);
      salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
    } else {
      novaPescaArtesanal.benfeitoria = { id: benfeitoria.id };
      console.log(novaPescaArtesanal.benfeitoria.id, "se não estiver correto, devo obedecer o modo de proceder do hook");
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
      console.log("useInputPescaArtesanal_b", novaPescaArtesanal);

      if (netInfoState.isConnected && isConnected) {
        console.log("useInputPescaArtesanal_c", novaPescaArtesanal);
        try {
          await connectionAPIPost('http://192.168.100.28:8080/pesca-artesanal', novaPescaArtesanal);
          console.log("useInputPescaArtesanal_d", novaPescaArtesanal);
        } catch (error) {
          const pescaArtesanalDataQueue = objetoFila();
          salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
          console.log("useInputPescaArtesanal_e", novaPescaArtesanal);
        }
      } else {
        const pescaArtesanalDataQueue = objetoFila();
        salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
        console.log("useInputPescaArtesanal_f", novaPescaArtesanal);
      }
    }
  };

  return {
    novaPescaArtesanal,
    inputPescaArtesanalApi,
    disabled,
  };


}