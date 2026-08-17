import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { CreditoType } from '../../../shared/types/CreditoType';

interface CreditoSectionProps {
  credito: CreditoType;
  children?: React.ReactNode;
}

const CreditoSection = ({
  credito,
  children,
}: CreditoSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Crédito"
        helperText="Toque para visualizar"
        summary={
          <>
            <Text type={textTypes.BUTTON_BOLD}>
              {credito.nome || 'Crédito não informado'}
            </Text>

            <Text type={textTypes.BUTTON_REGULAR}>
              Valor: {credito.valor}
            </Text>
          </>
        }
      >
        {renderField('Nome', credito.nome)}

        {renderField(
          'Valor',
          credito.valor?.toString()
        )}

        {renderField(
          'Sincronizado',
          credito.sincronizado ? 'Sim' : 'Não'
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default CreditoSection;