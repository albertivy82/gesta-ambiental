import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";
import { FIELD_LABEL_BENFEITORIA } from "./FieldsLabel";


export const validateBenfeitoria = (data: BenfeitoriaInput) => {
  const errors: { field: keyof BenfeitoriaInput; message: string }[] = [];

  // 1) Campos obrigatórios "simples"
  ([
    'tipoBenfeitoria',
    'funcao',
    'impermeabilizacaoSolo',
    'limites',
    'paredes',
    'tipoCobertura',
    'tipoEsquadrias',
    'origemMadeiraDaConstrucao',
    'origemPedraDaConstrucao',
    'origemAreiaDaConstrucao',
    'efluentes',
    'residuos',
    'fonteEnergia',
    'energiaAlimentos',
    'meiosLocomocao',
    'informativoPredominante',
  ] as (keyof BenfeitoriaInput)[]).forEach((f) => {
    const v = data[f] as any;
    if (v === '' || v === null || v === undefined) {
      errors.push({
        field: f,
        message: `Preencha ${FIELD_LABEL_BENFEITORIA[f]}.`,
      });
    }
  });

  // 2) Afastamento da principal – obrigatório se NÃO for "Principal"
  if (data.funcao && data.funcao !== 'Principal') {
    if (!data.afastamentoDaPrincipal || data.afastamentoDaPrincipal.trim() === '') {
      errors.push({
        field: 'afastamentoDaPrincipal',
        message: `Preencha ${FIELD_LABEL_BENFEITORIA['afastamentoDaPrincipal']}.`,
      });
    }
  }

  // 3) Área da benfeitoria (número, faixa razoável)
  if (
    data.areaBenfeitoria === undefined ||
    data.areaBenfeitoria === null ||
    Number.isNaN(data.areaBenfeitoria) ||
    data.areaBenfeitoria <= 0 ||
    data.areaBenfeitoria > 1000000
  ) {
    errors.push({
      field: 'areaBenfeitoria',
      message: 'Informe uma área da benfeitoria maior que 0 e menor ou igual a 1.000.000 m².',
    });
  }

  // 4) Pavimentos – número inteiro em faixa razoável (ex.: 1 a 50)
  if (
    data.pavimentos === undefined ||
    data.pavimentos === null ||
    Number.isNaN(data.pavimentos) ||
    data.pavimentos < 1 ||
    data.pavimentos > 50
  ) {
    errors.push({
      field: 'pavimentos',
      message: 'Informe um número de pavimentos entre 1 e 50.',
    });
  }

  // 5) Alagamentos – se houve ocorrência, época é obrigatória
  // (no hook, você grava "Não" ou algo tipo "ocorrencia: BAIXA")
  if (!data.alagamentos || data.alagamentos.trim() === '') {
    errors.push({
      field: 'alagamentos',
      message: `Preencha ${FIELD_LABEL_BENFEITORIA['alagamentos']}.`,
    });
  } else if (
    data.alagamentos.toLowerCase().includes('ocorrencia') && // houve algum tipo de ocorrência
    (!data.epocaOcorrencia || data.epocaOcorrencia.trim() === '')
  ) {
    errors.push({
      field: 'epocaOcorrencia',
      message: `Preencha ${FIELD_LABEL_BENFEITORIA['epocaOcorrencia']}.`,
    });
  }

  // monta labels faltando (igual Entrevistado)
  const missingFieldLabels = Array.from(
    new Set(
      errors
        .map((e) => FIELD_LABEL_BENFEITORIA[e.field])
        .filter(Boolean)
    )
  );

  return {
    isValid: errors.length === 0,
    errors,
    missingFieldLabels,
  };
};
