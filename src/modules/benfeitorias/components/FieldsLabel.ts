import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";

// nomes bonitinhos pra mostrar pro usuário
export const FIELD_LABEL_BENFEITORIA: Partial<Record<keyof BenfeitoriaInput, string>> = {
  
  tipoBenfeitoria: 'Finalidade da benfeitoria',
  funcao: 'Função da benfeitoria',
  afastamentoDaPrincipal: 'Localização em relação à edificação principal',
  impermeabilizacaoSolo: 'Impermeabilização do solo',
  limites: 'Tipo de limites da benfeitoria',
  areaBenfeitoria: 'Área da benfeitoria (m²)',
  pavimentos: 'Número de pavimentos',
  paredes: 'Material das paredes da benfeitoria',
  tipoCobertura: 'Material da cobertura da benfeitoria',
  tipoEsquadrias: 'Material das esquadrias da benfeitoria',
  origemMadeiraDaConstrucao: 'Origem da madeira utilizada na construção',
  origemPedraDaConstrucao: 'Origem da pedra utilizada na construção',
  origemAreiaDaConstrucao: 'Origem da areia utilizada na construção',
  alagamentos: 'Ocorrência de alagamentos ou enchentes',
  epocaOcorrencia: 'Época do ano em que ocorrem/ocorreram os alagamentos',
  efluentes: 'Destino dos efluentes sanitários',
  residuos: 'Destino do lixo produzido',
  fonteEnergia: 'Fonte de energia elétrica',
  energiaAlimentos: 'Fonte de energia usada para produção de alimentos',
  meiosLocomocao: 'Meio de locomoção mais usado para deslocamento',
  informativoPredominante: 'Meios de informação mais utilizados pela família',
};
