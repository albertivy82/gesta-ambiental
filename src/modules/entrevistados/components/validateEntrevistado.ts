import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { FIELD_LABEL_ENTREVISTADO } from "./FieldsLabel";

export const validateEntrevistado = (data: EntrevistadoInput) => {
    const errors: { field: keyof EntrevistadoInput; message: string }[] = [];
  
    // 1) obrigatórios "simples" – os que você já estava exigindo
    ([
      'nome',
      'naturalidade',
      'sexo',
      'apelido',
      'escolaridade',
      'estadoCivil',
      'religiao',
      'morador',
      'dataChegada',
      'pretendeMudar',
      'relacaoAreaImovel',
      'relacaoVizinhos',
      'tipoAlimentacao',
      'localCompras',
      'comoCuidaSaudeFamilia',
      'servicosDeficitarios',
      'problemasDeViolenciaLocal',
      'instituicaoConhecida',
      'importanciaDeProtegerAmbiente',
      'importanciaDeProtegerFauna',
      'qualEspacoPrecisaSerPreservado',
      'problemasRelacionadosAoAmbiente',
      'conheceUcs',
      'conheceUcProposta',
      'conheceAreaUc',
      'utilizaAreaUc',
      'propostaMelhorarArea',
      'indicadoConsultaPublica',
      'contatoIndicadoConsultaPublica',
    ] as (keyof EntrevistadoInput)[]).forEach((f) => {
      const v = data[f] as any;
      if (v === '' || v === null || v === undefined) {
        errors.push({
          field: f,
          message: `Preencha ${FIELD_LABEL_ENTREVISTADO[f]}.`,
        });
      }
    });
  
    // 2) idade (nascimentoData no seu modelo)
    if (
      data.nascimentoData === undefined ||
      data.nascimentoData === null ||
      Number.isNaN(data.nascimentoData) ||
      data.nascimentoData < 18 ||
      data.nascimentoData > 120
    ) {
      errors.push({
        field: 'nascimentoData',
        message: 'Informe uma idade entre 18 e 120 anos.',
      });
    }

      // 3) condicional: se pretende mudar = Sim → motivo obrigatório
      if (data.pretendeMudar === 'Sim') {
        if (!data.motivoVontadeMudanca || data.motivoVontadeMudanca.trim() === '') {
          errors.push({
            field: 'motivoVontadeMudanca',
            message: `Preencha ${FIELD_LABEL_ENTREVISTADO['motivoVontadeMudanca']}.`,
          });
        }
      }
  
    // 4) números de assaltos
    if (data.sofreuAssaltos < 0 || data.sofreuAssaltos > 200) {
      errors.push({
        field: 'sofreuAssaltos',
        message: 'O número de vezes que sofreu assalto deve estar entre 0 e 200.',
      });
    }
    if (data.presenciouAssalto < 0 || data.presenciouAssalto > 200) {
      errors.push({
        field: 'presenciouAssalto',
        message: 'O número de vezes que presenciou assalto deve estar entre 0 e 200.',
      });
    }
  
   
  
    // 6) regra da indicação: você populou com "Ninguém" e "Não se aplica" às vezes.
    // então só cobra contato quando NÃO for "Ninguém"
    if (
      data.indicadoConsultaPublica &&
      data.indicadoConsultaPublica !== 'Ninguém' &&
      (!data.contatoIndicadoConsultaPublica || data.contatoIndicadoConsultaPublica.trim() === '')
    ) {
      errors.push({
        field: 'contatoIndicadoConsultaPublica',
        message: 'Informe um contato do indicado.',
      });
    }
  
    const missingFieldLabels = Array.from(
      new Set(
        errors
          .map((e) => FIELD_LABEL_ENTREVISTADO[e.field])
          .filter(Boolean)
      )
    );
  
    return {
      isValid: errors.length === 0,
      errors,
      missingFieldLabels,
    };
  };
  