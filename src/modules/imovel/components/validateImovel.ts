// src/modules/Imovel/components/validateImovel.ts
import { imovelInput } from "../../../shared/types/imovelInput";
import { FIELD_LABEL_IMOVEL } from "./FieldsLabel";


export const validateImovel = (data: imovelInput) => {
  const errors: { field: keyof imovelInput; message: string }[] = [];

  // 1) obrigatórios "simples" (os que você já checava no useEffect)
  ([
    "rua",
    "numero",
    "bairro",
    "referencial",
    "latitude",
    "longitude",
    "tipoSolo",
    "vizinhosConfinantes",
    "situacaoFundiaria",
    "documentacaoImovel",
    "limites",
    "linhasDeBarco",
    "linhasOnibus",
    "pavimentacao",
    "iluminacaoPublica",
    "equipamentosUrbanos",
    "espacosEsporteLazer",
    "programaInfraSaneamento",
  ] as (keyof imovelInput)[]).forEach((f) => {
    const v = data[f] as any;
    if (v === "" || v === null || v === undefined) {
      errors.push({
        field: f,
        message: `Preencha ${FIELD_LABEL_IMOVEL[f]}.`,
      });
    }
  });

  // 2) área do imóvel (mesma regra que você já usa no hook)
  if (
    data.areaImovel === undefined ||
    data.areaImovel === null ||
    Number.isNaN(data.areaImovel) ||
    data.areaImovel < 10 ||
    data.areaImovel > 1_000_000
  ) {
    errors.push({
      field: "areaImovel",
      message: "Informe uma área entre 10 m² e 1.000.000 m².",
    });
  }

  // (opcional) se quiser, no futuro, pode validar formato de latitude/longitude aqui.

  const missingFieldLabels = Array.from(
    new Set(
      errors
        .map((e) => FIELD_LABEL_IMOVEL[e.field])
        .filter(Boolean)
    )
  );

  return {
    isValid: errors.length === 0,
    errors,
    missingFieldLabels,
  };
};
