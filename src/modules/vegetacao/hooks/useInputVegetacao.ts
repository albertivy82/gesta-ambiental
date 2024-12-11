import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { salvarVegetacaoQueue } from "../../../realm/services/vegetacaoService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_VEGETACAO_INPUT: VegetacaoInput = {
  usoMedicinal: null,
  usoAlimentacao: null,
  usoOrnamental: null,
  usoComercial: null,
  usaFlor: null,
  usaFolha: null,
  usaSemente: null,
  usaFruto: null,
  usaCasca: null,
  usaRaiz: null,
  usoLeiteLatex: null,
  outrosUsos: null,
  coletaLocalPublico: null,
  coletaCultivo: null,
  coletaCompra: null,
  coletaAmbienteEspecifica: null,
  quemEnsinouUso: '',
  repassaConhecimento: '',
  observacoesEspontaneas: '',
  benfeitoria: {
    id: 0,
  },
};

export const useNovaVegetacao = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novaVegetacao, setNovaVegetacao] = useState<VegetacaoInput>(DEFAULT_VEGETACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaVegetacao);
    if (
      novaVegetacao.usoMedicinal !== null &&
      novaVegetacao.usoAlimentacao !== null &&
      novaVegetacao.usoOrnamental !== null &&
      novaVegetacao.usoComercial !== null &&
      novaVegetacao.usaFlor !== null &&
      novaVegetacao.usaFolha !== null &&
      novaVegetacao.usaSemente !== null &&
      novaVegetacao.usaFruto !== null &&
      novaVegetacao.usaCasca !== null &&
      novaVegetacao.usaRaiz !== null &&
      novaVegetacao.usoLeiteLatex !== null &&
      novaVegetacao.outrosUsos !== null &&
      novaVegetacao.coletaLocalPublico !== null &&
      novaVegetacao.coletaCultivo !== null &&
      novaVegetacao.coletaCompra !== null &&
      novaVegetacao.coletaAmbienteEspecifica !== null &&
      novaVegetacao.quemEnsinouUso !== '' &&
      novaVegetacao.repassaConhecimento !== '' &&
      novaVegetacao.observacoesEspontaneas !== ''
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaVegetacao]);

  const objetoFila = () => {
    const vegetacaoData: VegetacaoInput = {
      ...novaVegetacao,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para o registro de vegetação
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      vegetacaoData.benfeitoria = { id: benfeitoriaId };
      vegetacaoData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        vegetacaoData.idFather = idBenfeitoriaLocal;
        vegetacaoData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return vegetacaoData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const vegetacaoDataQueue = objetoFila();
      salvarVegetacaoQueue(vegetacaoDataQueue);
      console.log("Vegetação case: benfeitoria offline");
    } else {
      novaVegetacao.benfeitoria = { id: benfeitoriaId };
      const netInfoState = await NetInfo.fetch();
      const isConnected = await testConnection();
  
      if (netInfoState.isConnected && isConnected) {
        try {
          await connectionAPIPost('http://192.168.100.28:8080/vegetacao', novaVegetacao);
        } catch (error) {
          const vegetacaoDataQueue = objetoFila();
          salvarVegetacaoQueue(vegetacaoDataQueue);
        }
      } else {
        const vegetacaoDataQueue = objetoFila();
        salvarVegetacaoQueue(vegetacaoDataQueue);
      }
    }
  };
  
  

}