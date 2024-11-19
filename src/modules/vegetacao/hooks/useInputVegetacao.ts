import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ServicosComunicacaoInput } from "../../../shared/types/ComunicacaoInput";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";

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

export const useNovaVegetacao = (id: number) => {
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
      benfeitoria: {
        id: id,
      },
      sincronizado: false,
      idLocal: uuidv4(),
    };
    return vegetacaoData;
  };

}