import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { AtividadeProdutivaType } from '../../../shared/types/AtividadeProdutiva';


interface AtividadeProdutivaSectionProps {
  atividadeProdutiva: AtividadeProdutivaType;
  children?: React.ReactNode;
}

const AtividadeProdutivaSection = ({
  atividadeProdutiva,
  children,
}: AtividadeProdutivaSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Atividade Produtiva"
        helperText="Toque para visualizar"
        summary={
          <>
            <Text type={textTypes.BUTTON_BOLD}>
              {atividadeProdutiva.atividade || 'Atividade não informada'}
            </Text>

            <Text type={textTypes.BUTTON_REGULAR}>
              {atividadeProdutiva.pessoasEnvolvidas} pessoa(s) envolvida(s)
            </Text>
          </>
        }
      >
        {renderField(
          'Atividade',
          atividadeProdutiva.atividade
        )}

        {renderField(
          'Pessoas envolvidas',
          atividadeProdutiva.pessoasEnvolvidas?.toString()
        )}

        {renderField(
          'Faturamento mensal total',
          atividadeProdutiva.faturamentoAtividadeMesTotal?.toString()
        )}

        {renderField(
          'Sincronizado',
          atividadeProdutiva.sincronizado ? 'Sim' : 'Não'
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default AtividadeProdutivaSection;