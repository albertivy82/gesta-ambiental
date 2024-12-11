import NetInfo from "@react-native-community/netinfo";
import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { PeixesInput } from "../../../shared/types/PeixesInput";
import { MamiferosType } from "../../../shared/types/MamiferosType";
import { MamiferosInput } from "../../../shared/types/MamiferosInput";
import { PescaArtesanalInput } from "../../../shared/types/PescaArtesanalInput";
import { salvarPescaArtesanalQueue } from "../../../realm/services/pescaService";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_PESCA_ARTESANAL_INPUT: PescaArtesanalInput = {
  freqPescaSemanal: 0,
  horasPorDia: 0,
  localDaPesca: '',
  horarioPrefencialPesca: '',
  descartePorPescaria: 0,
  conservacaoPeixe: [],
  custeio: [],
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

// Hook para manipular um novo registro de `PescaArtesanal`
export const useNovaPescaArtesanal = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novaPescaArtesanal, setNovaPescaArtesanal] = useState<PescaArtesanalInput>(DEFAULT_PESCA_ARTESANAL_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaPescaArtesanal);
    if (
      novaPescaArtesanal.freqPescaSemanal > 0 &&
      novaPescaArtesanal.horasPorDia > 0 &&
      novaPescaArtesanal.localDaPesca !== '' &&
      novaPescaArtesanal.horarioPrefencialPesca !== '' &&
      novaPescaArtesanal.descartePorPescaria >= 0 &&
      novaPescaArtesanal.conservacaoPeixe.length > 0 &&
      novaPescaArtesanal.custeio.length > 0 &&
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
    } else {
      setDisabled(false);
    }
  }, [novaPescaArtesanal]);

  const objetoFila = () => {
    const pescaArtesanalData: PescaArtesanalInput = {
      ...novaPescaArtesanal,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      pescaArtesanalData.benfeitoria = { id: benfeitoriaId };
      pescaArtesanalData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        pescaArtesanalData.idFather = idBenfeitoriaLocal;
        pescaArtesanalData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return pescaArtesanalData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const pescaArtesanalDataQueue = objetoFila();
      salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
      console.log("Pesca Artesanal case: benfeitoria offline");
    } else {
      novaPescaArtesanal.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/pesca-artesanal', novaPescaArtesanal);
        } catch (error) {
          const pescaArtesanalDataQueue = objetoFila();
          salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
        }
      } else {
        const pescaArtesanalDataQueue = objetoFila();
        salvarPescaArtesanalQueue(pescaArtesanalDataQueue);
      }
    }
  };
  
  


}