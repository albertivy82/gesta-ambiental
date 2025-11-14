// src/modules/Imovel/components/FieldsLabelImovel.ts
import { imovelInput } from "../../../shared/types/imovelInput";

export const FIELD_LABEL_IMOVEL: Partial<Record<keyof imovelInput, string>> = {
  rua: "Rua",
  numero: "Número",
  bairro: "Bairro",
  referencial: "Ponto de referência",
  latitude: "Latitude",
  longitude: "Longitude",
  areaImovel: "Área do imóvel (m²)",
  tipoSolo: "Tipo de solo",
  vizinhosConfinantes: "Vizinhos confinantes",
  situacaoFundiaria: "Situação fundiária",
  documentacaoImovel: "Documentação do imóvel",
  limites: "Limites do imóvel",
  linhasDeBarco: "Linhas de barco",
  linhasOnibus: "Linhas de ônibus",
  pavimentacao: "Pavimentação",
  iluminacaoPublica: "Iluminação pública",
  equipamentosUrbanos: "Equipamentos urbanos",
  espacosEsporteLazer: "Espaços de esporte e lazer",
  programaInfraSaneamento: "Programa de infraestrutura/saneamento",
  entrevistado: "Entrevistado",
};
