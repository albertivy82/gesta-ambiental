import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { ServicosComunicacaoType } from '../../../shared/types/ComunicacaoType';


interface ServicosComunicacaoSectionProps {
  servico: ServicosComunicacaoType;
  children?: React.ReactNode;
}

const ServicosComunicacaoSection = ({
  servico,
  children,
}: ServicosComunicacaoSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Serviço de Comunicação"
        helperText="Toque para visualizar"
        summary={
          <>
            <Text type={textTypes.BUTTON_BOLD}>
              {servico.tipoServicoComunicacao || 'Serviço não informado'}
            </Text>

            <Text type={textTypes.BUTTON_REGULAR}>
              {servico.operadoraServicoComunicacao ||
                'Operadora não informada'}
            </Text>
          </>
        }
      >
        {renderField(
          'Tipo de serviço',
          servico.tipoServicoComunicacao
        )}

        {renderField(
          'Operadora',
          servico.operadoraServicoComunicacao
        )}

        {renderField(
          'Sincronizado',
          servico.sincronizado ? 'Sim' : 'Não'
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default ServicosComunicacaoSection;